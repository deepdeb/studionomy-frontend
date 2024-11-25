import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isAuthenticated(): boolean {
        try {
            const userId = localStorage.getItem('slUserId');
            return userId ? true : false;
        }
        catch (error) {
            return false;
        }
    }
}
