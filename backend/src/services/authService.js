const {auth, db} = require('../config/firebase')


class AuthService {

    // Register
    async _createUserDocument(userRecord){
        try {
            const { uid, email, displayName, emailVerified } = userRecord;

            await db.collection('users').doc(uid).set({
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                createdAt: Date.now(),
                lastLoginAt: Date.now(),
                role: 'user'
            })
        } catch (error) {
            throw error;
        }
    }

    async Register(userData) {
        try {
            const {email, password, displayName} = userData;

            if(!email || !password){
                throw new Error('Please provide email and password')
            }

            const userRecord  = await auth.createUser({
                email,
                password,
                displayName: displayName || email.split('@')[0],
                emailVerified: false
            })

            const token = await auth.createCustomToken(userRecord .uid);

            await this._createUserDocument(userRecord );

            return {
                uid: userRecord .uid,
                email: userRecord .email,
                displayName: userRecord .displayName,
                token
            }

        } catch (error) {
            throw error;
        }
    }

    // Login
     async _updateLastLogin(uid){
        try {
            await db.collection('users').doc(uid).update({
                lastLoginAt: Date.now()
            })
        } catch (error) {
            throw error;
        }
     }

    async login(Token){
        try {
            if(!Token){
                throw new Error("Please Provide Token")
            }

            const decodedToken = await auth.verifyIdToken(token);

            const userRecord = await auth.getUser(decodedToken.uid);

            await this._updateLastLogin(userRecord.uid);

            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                emailVerified: userRecord.emailVerified,
            }
        } catch (error) {
            throw error;
        }
    }

    // get profile user by id
    async _getUserDocument(uid){
        try {
            const docRef = db.collection('users').doc(uid);

            if(!docRef.exists){
                throw new Error(`No User Found with ID ${uid}`);
            }

            return docRef.data();
        } catch (error) {
            return null;
        }
    }

    async getProfile(uid){
        try {
            if(!uid){
            throw new Error('Please Provide UID');
        }

            const userRecord = await auth.getUser(uid)

            const userDoc =  await this._getUserDocument(uid);

        return{
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            emailVerified: userRecord.emailVerified,
            ...userDoc
        }
       } catch (error) {
            throw error;
       }
    }

    // update profile
    async _updateUserDocument(uid, data){
        try {
            await db.collection('users').doc(uid).update({
            ...data,
            updatedAt: Date.now()
        })
        } catch (error) {
            throw error;
        }
    }

    async UpdateProfile(uid, updateData){
        try {
            if(!uid){
            throw new Error('Please Provide UID');
        }
        const{displayName, ...otherData} = updateData;

        const authUpdateData = {};
        if(displayName){
            authUpdateData.displayName = displayName;
        }

        if (Object.keys(otherData).length > 0) {
            await this._updateUserDocument(uid, otherData);
        }

        return await this.getProfile(uid);

        } catch (error) {
            throw error;
        }
    }
 }

 module.exports = new AuthService();