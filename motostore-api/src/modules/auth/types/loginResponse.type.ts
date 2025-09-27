import { PublicUserPayload } from './publicUserPayload.type';

export type LoginResponse = { user: PublicUserPayload; accessToken: string };
