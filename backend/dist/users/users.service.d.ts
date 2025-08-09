import { SupabaseClient } from '@supabase/supabase-js';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private supabase;
    constructor(supabase: SupabaseClient);
    create(createUserDto: CreateUserDto & {
        password: string;
    }): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findById(id: string): Promise<any>;
    findBySharingCode(sharingCode: string): Promise<{
        id: any;
        name: any;
        email: any;
        sharing_code: any;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    connectWithSharingCode(userId: string, sharingCode: string): Promise<{
        message: string;
        connectedUserName: any;
        connectedUserEmail: any;
        sharedCode: any;
    }>;
    getUsersBySharingCode(sharingCode: string): Promise<{
        id: any;
        name: any;
        email: any;
        sharing_code: any;
    }[]>;
}
