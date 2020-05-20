import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import * as firebase from 'firebase';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Campaign } from '../models/campaign';
import { Schedule } from '../models/schedule';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private collection = 'campaigns';

  constructor(public db: AngularFirestore) {}

  asIsOrder = (a, b) => 1;

  getAll(sort: string): Observable<Array<Campaign>> {
    const dbRef = this.db.collection(this.collection, ref => ref.orderBy(sort, 'desc'));
    return dbRef.snapshotChanges().pipe(
      map(snapshots => {
        return snapshots.map(snapshot => {
          const doc = snapshot.payload.doc as any;
          return new Campaign(doc.id, doc.data().name, doc.data().content, doc.data().schedule);
        });
      })
    );
  }

  byId(id: string): Observable<Campaign> {
    return this.db.collection(this.collection).doc(id).valueChanges().pipe(
      map(value => {
        const data = value as any;
        return new Campaign(id, data.name, data.content, data.schedule);
      })
    );
  }

  add(name: string, content: any, schedule: any): Promise<any> {
    return this.db.collection(this.collection).add({
      name,
      content: Campaign.sanitize(content),
      schedule: Campaign.sanitize(schedule),
      start: Schedule.toTimestamp(schedule.dateStart, schedule.time),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  save(campaign: Campaign): Promise<any> {
    const value = campaign.value() as any;
    value.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    value.start = Schedule.toTimestamp(value.schedule.dateStart, value.schedule.time);
    return this.db.collection(this.collection).doc(campaign.id).set(value);
  }

  delete(id: string): Promise<any> {
    return this.db.collection(this.collection).doc(id).delete();
  }
}
