import { inject, Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user,
  User, UserCredential, updateProfile
} from '@angular/fire/auth';
import {Firestore, doc, setDoc, docData} from '@angular/fire/firestore';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import {UserProfile} from '../../interfaces/user.interface';



@Injectable({ providedIn: "root" })
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  public readonly currentUser$: Observable<User | null> = user(this.auth);

  constructor() {}

  register(email: string, password: string, displayName: string): Observable<UserCredential | null> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap(async (userCredential) => {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });

        await this.createUserProfile(userCredential.user, displayName);

        return userCredential;
      }),
      catchError(err => {
        console.error('Registration error:', err);
        return of(null);
      })
    );
  }

  private async createUserProfile(user: User, displayName: string): Promise<void> {
    const userDoc = doc(this.firestore, `users/${user.uid}`);

    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName,
      createdAt: new Date()
    };

    await setDoc(userDoc, userProfile);
  }

  login(email: string, password: string): Observable<UserCredential | null> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap(async (userCredential) => {
        await this.updateLastLogin(userCredential.user.uid);
        return userCredential;
      }),
      catchError(err => {
        console.error('Login error:', err);
        return of(null);
      })
    );
  }

  private async updateLastLogin(userId: string): Promise<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    await setDoc(userDoc, { lastLogin: new Date() }, { merge: true });
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  getCurrentUserId(): Observable<string | null> {
    return this.currentUser$.pipe(
      map(user => user?.uid || null)
    );
  }

  getUserProfile(userId: string): Observable<UserProfile | null> {
    try {
      const userDoc = doc(this.firestore, `users/${userId}`);
      return docData(userDoc).pipe(
        catchError(error => {
          console.error('Error getting user profile:', error);
          return of(null);
        })) as Observable<UserProfile | null>
    } catch (error) {
      console.error('Error getting user profile:', error);
      return of(null);
    }
  }
}
