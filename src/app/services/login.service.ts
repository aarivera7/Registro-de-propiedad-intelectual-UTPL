import { Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword, signOut, user, signInWithRedirect, signInWithPopup, OAuthProvider, linkWithPopup, UserCredential, GoogleAuthProvider } from "@angular/fire/auth";
import { Firestore, getDoc, doc } from '@angular/fire/firestore';

import { User } from "../models/user";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    public userCache: any = null
    user$ = user(this.auth)
    aUser?: User
    uid!: string


    constructor(public auth: Auth, private firestore: Firestore){ 
        this.user$.subscribe(aUser => {
            if (!aUser) return;
            this.aUser = {name: aUser.displayName!, lastName: "", email: aUser.email!, uid: aUser.uid, photoURL: aUser.photoURL!, rol: "user"};
            this.uid = aUser.uid;
       })
    }

    async login({email, password}: any): Promise<UserCredential>{
        return signInWithEmailAndPassword(this.auth, email, password)
    }

    async loginWithMicrosoft(email: string): Promise<UserCredential>{
        const provider = new OAuthProvider('microsoft.com');
        provider.setCustomParameters({
            // Force re-consent.
            prompt: 'consent',
            // Target specific email with login hint.
            login_hint: email,
            tenant: environment.tenant
        });

        return signInWithPopup(this.auth, provider)
    }

    async linkWithMicrosoft(): Promise<void>{
        const provider = new OAuthProvider('microsoft.com');
        provider.setCustomParameters({
            tenant: environment.tenant
        });

        linkWithPopup(this.auth.currentUser!, provider).then((result) => {
            // Microsoft credential is linked to the current user.
            // IdP data available in result.additionalUserInfo.profile.

            // Get the OAuth access token and ID Token
            const credential = OAuthProvider.credentialFromResult(result);
            const accessToken = credential!.accessToken;
            const idToken = credential!.idToken;
            })
        .catch((error) => {
            // Handle error.
        });
    }

    loginWithGoogle(email: string): Promise<UserCredential>{
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            'login_hint': email
        });

        return signInWithPopup(this.auth, provider)
    }

    logout(): Promise<void>{
        this.uid = ""
        this.aUser = undefined
        this.userCache = null
        return signOut(this.auth)
    }

    async getDataUser(id: string): Promise<User>{
        if (this.userCache) {
            return this.userCache.data() as Promise<User>;
        } else {
            const userRef = doc(this.firestore, 'users', id)
            const user = await getDoc(userRef)
            this.userCache = user;
            if (user.exists()) {
                return user.data() as User
            } else {
                return this.aUser as User
            }
        }
    }
}