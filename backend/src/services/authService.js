const { auth, db, admin } = require('../config/firebase');

class AuthService {

    // ==================== REGISTER ====================
    async _createUserDocument(userRecord) {
        try {
            await db.collection('users').doc(userRecord.uid).set({
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
                role: 'user'
            });
        } catch (error) {
            console.error('Error creating user document:', error);
            throw new Error('Failed to create user document');
        }
    }

    async register(userData) {
        try {
            const { email, password, displayName } = userData;

            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            // Create user in Firebase Auth
            const userRecord = await auth.createUser({
                email,
                password,
                displayName: displayName || email.split('@')[0],
                emailVerified: false
            });

            // Create custom token
            const token = await auth.createCustomToken(userRecord.uid);

            // Create user document in Firestore
            await this._createUserDocument(userRecord);

            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                token
            };

        } catch (error) {
            console.error('Registration error:', error);
            if (error.code === 'auth/email-already-exists') {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    // ==================== LOGIN ====================
    async _updateLastLogin(uid) {
        try {
            await db.collection('users').doc(uid).update({
                lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    }

    async login(token) {
        try {
            if (!token) {
                throw new Error('Token is required');
            }

            // Verify Firebase ID token
            const decodedToken = await auth.verifyIdToken(token);

            // Get user record
            const userRecord = await auth.getUser(decodedToken.uid);

            // Update last login
            await this._updateLastLogin(userRecord.uid);

            // Get user document from Firestore
            const userDoc = await this._getUserDocument(userRecord.uid);

            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                emailVerified: userRecord.emailVerified,
                ...userDoc
            };

        } catch (error) {
            console.error('Login error:', error);
            if (error.code === 'auth/id-token-expired') {
                throw new Error('Token expired');
            }
            throw new Error('Invalid token');
        }
    }

    // ==================== GET USER PROFILE ====================
    async _getUserDocument(uid) {
        try {
            const docSnapshot = await db.collection('users').doc(uid).get();

            if (!docSnapshot.exists) {
                return null;
            }

            return docSnapshot.data();
        } catch (error) {
            console.error('Error getting user document:', error);
            return null;
        }
    }

    async getUserProfile(uid) {
        try {
            if (!uid) {
                throw new Error('User ID is required');
            }

            // Get user from Firebase Auth
            const userRecord = await auth.getUser(uid);

            // Get user document from Firestore
            const userDoc = await this._getUserDocument(uid);

            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                emailVerified: userRecord.emailVerified,
                ...userDoc
            };

        } catch (error) {
            console.error('Get profile error:', error);
            if (error.code === 'auth/user-not-found') {
                throw new Error('User not found');
            }
            throw error;
        }
    }

    // ==================== UPDATE USER PROFILE ====================
    async _updateUserDocument(uid, data) {
        try {
            await db.collection('users').doc(uid).update({
                ...data,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating user document:', error);
            throw new Error('Failed to update user document');
        }
    }

    async updateUserProfile(uid, updateData) {
        try {
            if (!uid) {
                throw new Error('User ID is required');
            }

            if (!updateData || Object.keys(updateData).length === 0) {
                throw new Error('Update data is required');
            }

            const { displayName, photoURL, phoneNumber, ...otherData } = updateData;

            // Update Firebase Auth fields
            const authUpdateData = {};
            if (displayName !== undefined) authUpdateData.displayName = displayName;
            if (photoURL !== undefined) authUpdateData.photoURL = photoURL;
            if (phoneNumber !== undefined) authUpdateData.phoneNumber = phoneNumber;

            if (Object.keys(authUpdateData).length > 0) {
                await auth.updateUser(uid, authUpdateData);
            }

            // Update Firestore document
            if (Object.keys(otherData).length > 0) {
                await this._updateUserDocument(uid, otherData);
            }

            // Return updated profile
            return await this.getUserProfile(uid);

        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }
}

module.exports = new AuthService();