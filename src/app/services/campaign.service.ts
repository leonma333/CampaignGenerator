import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';


import { Campaign } from '../models/campaign';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private collection = 'campaigns';

  constructor(public db: AngularFirestore) {}

  getAll(): Observable<Array<Campaign>> {
    return this.db.collection('campaigns').snapshotChanges().pipe(
      map(snapshots => {
        return snapshots.map(snapshot => {
          const doc = snapshot.payload.doc as any;
          return new Campaign(doc.id, doc.data().name, doc.data().content);
        });
      })
    );
  }

  byId(id: string): Observable<Campaign> {
    return this.db.collection(this.collection).doc(id).valueChanges().pipe(
      map(value => {
        const data = value as any;
        return new Campaign(id, data.name, data.content);
      })
    );
  }

  add(name: string, content: object): Promise<DocumentReference> {
    return this.db.collection(this.collection).add({
      name,
      content: Object.assign({}, content)
    });
  }

  save(campaign: Campaign): Promise<void> {
    return this.db.collection(this.collection).doc(campaign.id).set(campaign.value);
  }

  delete(id: string): Promise<void> {
    return this.db.collection(this.collection).doc(id).delete();
  }
}
