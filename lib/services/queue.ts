export type Job = {
  id: string;
  type: string;
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
};

/**
 * A lightweight in-memory queue to act as a placeholder for BullMQ/Redis.
 * This satisfies the PRD's async fetch architecture requirement.
 */
export class MemoryQueueService {
  private queue: Job[] = [];
  private processing: boolean = false;

  constructor(private handler: (job: Job) => Promise<void>) {}

  async addJob(type: string, data: any) {
    const job: Job = {
      id: Math.random().toString(36).substring(7),
      type,
      data,
      status: 'pending'
    };
    this.queue.push(job);
    
    // Asynchronously kick off processing without awaiting
    setTimeout(() => this.processNext(), 0);
    return job.id;
  }

  private async processNext() {
    if (this.processing) return;
    const nextJob = this.queue.find(j => j.status === 'pending');
    if (!nextJob) return;

    this.processing = true;
    nextJob.status = 'processing';
    
    try {
      await this.handler(nextJob);
      nextJob.status = 'completed';
    } catch (e) {
      console.error(`Job ${nextJob.id} failed:`, e);
      nextJob.status = 'failed';
    } finally {
      this.processing = false;
      this.processNext(); // Process any remaining
    }
  }

  getJobs() {
    return this.queue;
  }
}
