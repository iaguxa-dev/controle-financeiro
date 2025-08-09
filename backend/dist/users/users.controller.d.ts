import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<any>;
    getUserBySharingCode(sharingCode: string): Promise<{
        id: any;
        name: any;
        email: any;
        sharing_code: any;
    }>;
    connectWithSharingCode(req: any, body: {
        sharing_code: string;
    }): Promise<{
        message: string;
        connectedUserName: any;
        connectedUserEmail: any;
        sharedCode: any;
    }>;
    getSharedUsers(sharingCode: string): Promise<{
        id: any;
        name: any;
        email: any;
        sharing_code: any;
    }[]>;
}
