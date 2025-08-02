import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

import { DictionaryInterface } from '../../../../interfaces';
import { copyToClipboard, toLowerCase, toTitleCase, toUpperCase } from '../../../../utils';

const endpoint: string = 'https://hdwallet.online/dumps';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './share.html',
  styleUrl: './share.css'
})
export class ShareComponent {

  copyDisable: boolean = false;
  copyMessage: 'Copy' | 'Copied' | 'Failed' = 'Copy';
  url: string = endpoint;
  shareFormGroup?: FormGroup;
  shareData: any;

  constructor(
    public formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  createGroupControls(controls: DictionaryInterface): DictionaryInterface {
    const groupControls: DictionaryInterface = { };
    for (const control in controls) {
      if (controls.hasOwnProperty(control)) {
        if (['generate', 'save', 'clear'].includes(control)) {
          groupControls[control] = [false, Validators.required];
        } else {
          groupControls[control] = [controls[control], Validators.required];
        }
      }
    }
    return groupControls;
  }

  updateShareData(data: DictionaryInterface): void {
    this.shareData = data;
    this.shareFormGroup = this.formBuilder.group(
      this.createGroupControls(this.shareData)
    );
    this.makeURL();
  }

  makeURL(): void {
    const controls = this.shareFormGroup?.value;
    this.changeDetectorRef.detectChanges();
    const ecc: string = toLowerCase(this.shareData['ecc']);
    const symbol: string = toUpperCase(this.shareData['symbol']);
    let url: URL = new URL(`${endpoint}/${ecc}/${symbol}`);
    for (let control in controls) {
      if (controls[control] && !['ecc', 'symbol'].includes(control)) {
        if (['hd', 'client', 'derivation'].includes(control)) {
          url.searchParams.set(toLowerCase(control), toTitleCase(this.shareData[control]));
        } else if (['format'].includes(control)) {
          url.searchParams.set(toLowerCase(control), toUpperCase(this.shareData[control]));
        } else {
          url.searchParams.set(toLowerCase(this.normalizeKey(control)), this.shareData[control]);
        }
      }
    }
    this.url = url.toString();
  }

  async copyURL(url: string): Promise<void> {
    this.copyDisable = true;

    try {
      const isCopied = await copyToClipboard(url);
      this.copyMessage = isCopied ? 'Copied' : 'Failed';
    } catch {
      this.copyMessage = 'Failed';
    }
    this.changeDetectorRef.detectChanges();

    setTimeout(() => {
      this.copyDisable = false;
      this.copyMessage = 'Copy';
      this.changeDetectorRef.detectChanges();
    }, 1000);
  }

  normalizeKey(key: string): string {
    if (key === 'mnemonicType') return 'mnemonic-type';
    if (key === 'xprivateKey') return 'xprivate-key';
    if (key === 'xpublicKey') return 'xpublic-key';
    if (key === 'privateKey') return 'private-key';
    if (key === 'publicKey') return 'public-key';
    if (key === 'spendPrivateKey') return 'spend-private-key';
    if (key === 'viewPrivateKey') return 'view-private-key';
    if (key === 'spendPublicKey') return 'spend-public-key';
    if (key === 'publicKeyType') return 'public-key-type';
    if (key === 'paymentID') return 'payment-id';
    if (key === 'cardanoType') return 'cardano-type';
    if (key === 'addressType') return 'address-type';
    if (key === 'stakingPublicKey') return 'staking-public-key';
    if (key === 'customClient') return 'custom-client';
    return key.toLowerCase();
  }
}
