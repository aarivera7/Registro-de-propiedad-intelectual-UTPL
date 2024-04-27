import { Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword, signOut, user, signInWithRedirect, OAuthProvider, linkWithPopup } from "@angular/fire/auth";
import { Firestore, getDoc, doc } from '@angular/fire/firestore';

import { User } from "../models/user";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    public userCache: any = null
    user$ = user(this.auth)
    uid!: string
    

    constructor(public auth: Auth, private firestore: Firestore){ 
        this.user$.subscribe(aUser => {
            if (!aUser) return
            this.uid = aUser.uid
            this.getDataUser(this.uid)
        })
    }

    login({email, password}: any){
        return signInWithEmailAndPassword(this.auth, email, password)
    }

    loginWithMicrosoft(email: string){
        const provider = new OAuthProvider('microsoft.com');
        provider.setCustomParameters({
            // Force re-consent.
            prompt: 'consent',
            // Target specific email with login hint.
            login_hint: email,
            tenant: environment.tenant
        });

        return signInWithRedirect(this.auth, provider)
    }

    linkWithMicrosoft(){
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

    logout(){
        return signOut(this.auth)
    }

    async getDataUser(id: string): Promise<User>{
        if (this.userCache) {
            return this.userCache.data() as Promise<User>;
        } else {
            const userRef = doc(this.firestore, 'users', id)
            const user = await getDoc(userRef)
            this.userCache = user;
            return user.data() as Promise<User>
        }
    }

    /*async getDataUser(): Promise<User>{
        
        if (this.userCache) {
            return this.userCache.data() as Promise<User>;
        } else {
            console.log(this.uid)
            const userRef = doc(this.firestore, 'users', this.uid)
            const user = await getDoc(userRef)
            this.userCache = user;
            return user.data() as Promise<User>
        }
      }*/

    ngOnInit(): void {
        this.user$.subscribe(aUser => {
            this.uid = aUser!.uid
            console.log(this.uid)
            console.log(aUser);
       })
    }

    /*

    token:string = "";

    login(email:string, password:string){
        firebase.auth().signInWithEmailAndPassword(email, password).then(
            response => firebase.auth().currentUser?.getIdToken().then(
                token => {
                    this.token = token;
                    this.router.navigate(['/app']);
                }
            )
        );
    }

    getIdToken(){
        return this.token;
    }*/
}