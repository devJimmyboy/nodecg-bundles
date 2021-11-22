/// <reference types="node" />
import { EventEmitter } from "events";
import { NodeCG, ReplicantServer } from "nodecg-types/types/server";
import { WebSocket } from "ws";
interface TwitchToken {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string[];
    token_type: "bearer";
}
export declare class Heat extends EventEmitter {
    channelId: string | number;
    users: Map<string, {
        display_name: string;
    }>;
    ws: WebSocket | null;
    token: ReplicantServer<TwitchToken>;
    constructor(channelId: string | number, nodecg: NodeCG);
    connect(): void;
    getUserById(id: string): Promise<{
        display_name: string;
    } | undefined>;
    getUserByName(name: string): Promise<{
        display_name: string;
    }>;
    getToken(): Promise<TwitchToken>;
    refreshConnection(): void;
    log(message: string | any): void;
}
export {};
