import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/module/database/database.service';

@Injectable()
export class UsersService {
    constructor(private db:DatabaseService) {}
 
}
