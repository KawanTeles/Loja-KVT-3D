/**
 * Async queue utility to process tasks sequentially and avoid race conditions or merge conflicts.
 */
class Queue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  /**
   * Enqueues a task and returns a promise that resolves when the task finishes execution.
   * @param {Function} task - An async function that represents the task.
   * @returns {Promise<any>} The result of the task execution.
   */
  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.process();
    });
  }

  /**
   * Processes the next task in the queue.
   */
  async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    const { task, resolve, reject } = this.queue.shift();
    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.processing = false;
      this.process(); // Trigger processing of the next item
    }
  }
}

export default new Queue();
