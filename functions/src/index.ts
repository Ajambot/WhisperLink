"use strict";

import * as functions from "firebase-functions"
import admin from "firebase-admin";
admin.initializeApp();

const firestore = admin.firestore();
exports.deleteOldRecords = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    const currentTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours in milliseconds
    const oldRecordsQuery = firestore.collection('Chats')
                                .where('createdAt', '<', new Date(currentTime));

    const batch = firestore.batch();
    const oldRecordsSnapshot = await oldRecordsQuery.get();

    oldRecordsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    functions.logger.log("Successfully deleted: ", oldRecordsSnapshot);
    return batch.commit();
});
