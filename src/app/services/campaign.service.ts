import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Campaign } from '../models/campaign';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private collection = 'campaigns';

  constructor(public db: AngularFirestore) {}

  getAll(): Observable<Array<Campaign>> {
    return this.db.collection(this.collection).snapshotChanges().pipe(
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

  add(name: string, content: object, schedule: object): Promise<any> {
    return this.db.collection(this.collection).add({
      name,
      content: Object.assign({}, content),
      schedule
    });
  }

  save(campaign: Campaign): Promise<any> {
    const value = {
      name: campaign.name,
      content: Object.assign({}, campaign.content),
      schedule: campaign.schedule
    };
    return this.db.collection(this.collection).doc(campaign.id).set(value);
  }

  delete(id: string): Promise<any> {
    return this.db.collection(this.collection).doc(id).delete();
  }
}
