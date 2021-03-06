import {Message} from './Message';
import * as AWS from 'aws-sdk';
import {Consumer} from "./Consumer";
/**
 * Type of function responsible for handling a consumer result.
 * Function MUST call one of ResultContext methods in order mark messages are rejected, acknowledge it or retry consumption
 */
export type ResultHandler<TMessage extends Message<any, any>> = (context: ResultContext<TMessage>, error?: any, result?: any) => Promise<void>;

export class ResultContext<TMessage extends Message<any, any>> {

    constructor(private sqs: AWS.SQS,
                private consumer: Consumer<TMessage>,
                private message: TMessage) {
    }

    async ack() {
        await this.sqs.deleteMessage({
            QueueUrl: this.message.queue.url,
            ReceiptHandle: this.message.raw.ReceiptHandle as string
        }, undefined).promise();

        this.consumer.emit('consumed', this.message);
    }
    
    async reject() {
        await this.sqs.changeMessageVisibility({
            QueueUrl: this.message.queue.url,
            ReceiptHandle: this.message.raw.ReceiptHandle as string,
            VisibilityTimeout: 0
        }, undefined).promise();

        this.consumer.emit('rejected', this.message);
    }
}