import { PublicUserPayload } from './publisUserPayload.type';

export type LoginResponse = { user: PublicUserPayload; accessToken: string };
