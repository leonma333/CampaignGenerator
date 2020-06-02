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

  getAll(sort: string, options: any = {}): Observable<Array<Campaign>> {
    const dbRef = this.db.collection(this.collection, ref => {
      let finalRef = ref.orderBy(sort, 'desc').limit(6);
      if (options.startAfter) {
        finalRef = finalRef.startAfter(options.startAfter);
      }
      if (options.startAt) {
        finalRef = finalRef.startAt(options.startAt);
      }
      if (options.endBefore)  {
        finalRef = finalRef.endBefore(options.endBefore);
      }
      return finalRef;
    });
    const obs$ = dbRef.snapshotChanges();
    return this.transformSnapshotsToCampaignsPipe(obs$);
  }

  byId(id: string): Observable<Campaign> {
    return this.db.collection(this.collection).doc(id).valueChanges().pipe(
      map(value => {
        const data = value as any;
        return new Campaign(id, data.name, data.content, data.schedule, data.demographic);
      })
    );
  }

  add(name: string, content: any, schedule: any, demographic: any): Promise<any> {
    return this.db.collection(this.collection).add({
      name,
      content: Campaign.sanitize(content),
      schedule: Campaign.sanitize(schedule),
      demographic: Campaign.sanitize(demographic),
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

  search(term: string): Observable<any> {
    const obs$ = this.db.collection(this.collection, ref =>
      ref.orderBy('name')
      .startAt(term)
      .endAt(term + '\uf8ff')
      .limit(5)
    ).snapshotChanges();
    return this.transformSnapshotsToCampaignsPipe(obs$);
  }

  delete(id: string): Promise<any> {
    return this.db.collection(this.collection).doc(id).delete();
  }

  private transformSnapshotsToCampaignsPipe(obs$: Observable<any>) {
    return obs$.pipe(
      map(snapshots => {
        return snapshots.map(snapshot => {
          const doc = snapshot.payload.doc as any;
          const campaign = new Campaign(doc.id, doc.data().name, doc.data().content, doc.data().schedule, doc.data().demographic);
          campaign.doc = doc;
          return campaign;
        });
      })
    );
  }
}
