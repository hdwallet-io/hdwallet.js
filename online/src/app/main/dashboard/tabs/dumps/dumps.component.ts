import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, Renderer2
} from '@angular/core';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import {
  AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { Cryptocurrency, CRYPTOCURRENCIES, getCryptocurrency } from '@hdwallet/core/cryptocurrencies';
import { Mnemonic, MNEMONICS } from '@hdwallet/core/mnemonics';
import { Derivation, DERIVATIONS } from '@hdwallet/core/derivations';
import { HDS } from '@hdwallet/core/hds';
import { ENTROPIES } from '@hdwallet/core/entropies';
import { SEEDS } from '@hdwallet/core/seeds';
import { HDWallet } from '@hdwallet/core';

import {
  toLowerCase, toUpperCase, toTitleCase, replaceUnderscore2Hyphen, getDateTimeStamp,
  saveAsCSV, saveAsJSON, objectIsIncluded, toBoolean
} from '../../../../../utils';
import {
  ComboboxInterface, DictionaryInterface, DumpsInterface, KeyValuePairInterface
} from '../../../../../interfaces';
import { StorageService } from '../../../../services/storage/storage.service';
import { CustomComboboxComponent } from '../../../../common/custom-combobox/custom-combobox.component';
import { TerminalService } from '../../../../services/terminal/terminal.service';
import { GroupBoxService } from '../../../../services/group-box/group-box.service';
import {
  publicKeyTypes, wifTypes, addressTypes, mnemonicTypes, clients, modes, cardanoTypes,
  changes, roles, customClients, semantics, formats, derivations, getAllowedDerivations
} from '../../../../../consts';

@Component({
  selector: 'app-dumps',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    NgClass,
    NgStyle,
    CustomComboboxComponent,
  ],
  providers: [
    StorageService
  ],
  templateUrl: './dumps.html',
  styleUrl: './dumps.css'
})
export class DumpsComponent implements OnInit, AfterViewInit {

  ecc: string = 'ALL';
  symbol: string = 'BTC';
  isLoading: boolean = false;
  cryptocurrency: typeof Cryptocurrency = getCryptocurrency(this.symbol);
  networks: ComboboxInterface[] = this.getNetworks(this.cryptocurrency.SYMBOL);
  hds: ComboboxInterface[] = this.getHDs(this.cryptocurrency.SYMBOL);
  hd: ComboboxInterface = { name: this.cryptocurrency.DEFAULT_HD, value: this.cryptocurrency.DEFAULT_HD };
  froms: ComboboxInterface[] = this.getFroms(this.hd.value);
  from: ComboboxInterface = this.froms[1];
  semantics: ComboboxInterface[] = this.getSemantics(this.hd.value);
  addressTypes: ComboboxInterface[] = addressTypes.map((item: string): ComboboxInterface => ({name: toTitleCase(item), value: item}));
  mnemonicTypes: ComboboxInterface[] = mnemonicTypes.map((item: string): ComboboxInterface => ({name: toTitleCase(item), value: item}));
  modes: ComboboxInterface[] = modes.map((item: string): ComboboxInterface => ({name: toTitleCase(item), value: item}));
  changes: ComboboxInterface[] = changes.map((item: KeyValuePairInterface): ComboboxInterface => ({name: item.key, value: item.value}));
  roles: ComboboxInterface[] = roles.map((item: KeyValuePairInterface): ComboboxInterface => ({name: item.key, value: item.value}));
  customClients: ComboboxInterface[] = customClients.map((item: KeyValuePairInterface): ComboboxInterface => ({name: item.key, value: item.value}));
  formats: ComboboxInterface[] = formats.map((item: string): ComboboxInterface => ({name: toUpperCase(item), value: item}));
  currentAllowedDerivations: string[] = getAllowedDerivations(this.hd.value, this.from.value);
  publicKeyTypes: ComboboxInterface[] = this.getPublicKeyTypes(this.hd.value);
  cardanoTypes: ComboboxInterface[] = this.getCardanoTypes(this.from.value);
  clients: ComboboxInterface[] = this.getClients(this.hd.value, this.symbol, this.from.value);
  languages: ComboboxInterface[] = this.getLanguages(this.clients[0].value);
  symbols: ComboboxInterface[] = this.getSymbols(this.ecc);
  derivations: string[] = derivations;
  isOverflowed: boolean = false;
  dumpsFormGroup: FormGroup;

  getSymbols(ecc: string): ComboboxInterface[] {
    if (toUpperCase(ecc) === 'ALL') {
      return CRYPTOCURRENCIES.getClasses().map(
        (item: typeof Cryptocurrency): ComboboxInterface => (
          { name: item.NAME, value: item.SYMBOL }
        )
      );
    } else {
      return CRYPTOCURRENCIES.getClasses().filter(
        (item: typeof Cryptocurrency): boolean => item.ECC.NAME === toTitleCase(ecc)
      ).map(
        (item: typeof Cryptocurrency): ComboboxInterface => (
          { name: item.NAME, value: item.SYMBOL }
        )
      );
    }
  }

  indexValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;
    const parts = value.split('-');
    if (parts.length === 2) {
      const firstNumber = parseInt(parts[0], 10);
      const secondNumber = parseInt(parts[1], 10);
      if (firstNumber >= secondNumber) {
        return { comparison: { firstNumber: firstNumber, secondNumber: secondNumber } };
      }
    }
    return null;
  }

  pathValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;
    const parts = value.substring(2).split('/');
    for (const part of parts) {
      const hyphenMatch = part.match(/^(\d+)-(\d+)'?$/);
      if (hyphenMatch) {
        const firstNumber = parseInt(hyphenMatch[1], 10);
        const secondNumber = parseInt(hyphenMatch[2], 10);
        if (firstNumber >= secondNumber) {
          return { comparison: { firstNumber: firstNumber, secondNumber: secondNumber } };
        }
      }
    }
    return null;
  }

  getSemantics(hd: string): ComboboxInterface[] {
    if (['BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'Cardano'].includes(hd)) {
      return this.cryptocurrency.SEMANTICS?.map((item: string) => ({name: toTitleCase(item), value: item})) || [];
    } else if (hd == 'BIP141') {
      return semantics.map((item: KeyValuePairInterface) => ({name: item.key, value: item.value}));
    }
    return [];
  }

  constructor(
    public formBuilder: FormBuilder,
    public terminalService: TerminalService,
    private storageService: StorageService,
    public groupBoxService: GroupBoxService,
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.dumpsFormGroup = this.formBuilder.group({
      symbol: [this.cryptocurrency.SYMBOL, [Validators.required]],
      network: [this.cryptocurrency.DEFAULT_NETWORK.NAME, [Validators.required]],
      hd: [this.hd.value, [Validators.required]],
      from: [this.from.value, [Validators.required]],
      client: ['BIP39', [Validators.required]],
      entropy: [null, [Validators.required, Validators.pattern(/^[a-fA-F0-9]+$/), Validators.minLength(32), Validators.maxLength(66)]],
      mnemonic: [null, [Validators.required]],
      mnemonicType: ['standard', [Validators.required]],
      language: ['english', [Validators.required]],
      seed: [null, [Validators.required]],
      xprivateKey: [null, [Validators.required]],
      xpublicKey: [null, [Validators.required]],
      strict: [true, [Validators.required]],
      privateKey: [null, [Validators.required, Validators.pattern(/^[a-fA-F0-9]+$/)]],
      wif: [null, [Validators.required]],
      publicKey: [null, [Validators.required, Validators.pattern(/^[a-fA-F0-9]+$/)]],
      spendPrivateKey: [null, [Validators.required, Validators.pattern(/^[a-fA-F0-9]+$/)]],
      viewPrivateKey: [null, [Validators.required, Validators.pattern(/^[a-fA-F0-9]+$/)]],
      spendPublicKey: [null, [Validators.required, Validators.pattern(/^[a-fA-F0-9]+$/)]],
      derivation: [this.currentAllowedDerivations[0], [Validators.required]],
      account: ['0', [Validators.required, Validators.pattern(/^\d+(-\d+)?$/), this.indexValidator]],
      change: ['external-chain', [Validators.required]],
      role: ['external-chain', [Validators.required]],
      address: ['0-10', [Validators.required, Validators.pattern(/^\d+(-\d+)?$/), this.indexValidator]],
      minor: ['1', [Validators.required, Validators.pattern(/^\d+(-\d+)?$/), this.indexValidator]],
      major: ['0-10', [Validators.required, Validators.pattern(/^\d+(-\d+)?$/), this.indexValidator]],
      path: ['m/0\'/0-1', [Validators.required, Validators.pattern(/^m(\/(\d+(-\d+)?'?)?)+$/), this.pathValidator]],
      publicKeyType: ['compressed', [Validators.required]],
      passphrase: [null, [Validators.required]],
      paymentID: [null, [Validators.pattern(/^[a-fA-F0-9]+$/), Validators.minLength(16), Validators.maxLength(16)]],
      cardanoType: ['shelley-icarus', [Validators.required]],
      addressType: ['payment', [Validators.required]],
      stakingPublicKey: [null, [Validators.required]],
      mode: ['standard', [Validators.required]],
      exclude: ['root', [Validators.pattern(/^([a-zA-Z0-9_-]+(:[a-zA-Z0-9_-]+)?)(,[a-zA-Z0-9_-]+(:[a-zA-Z0-9_-]+)?)*$/)]],
      include: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_-]+(:[a-zA-Z0-9_-]+)?)(,[a-zA-Z0-9_-]+(:[a-zA-Z0-9_-]+)?)*$/)]],
      bip38: [false, [Validators.required]],
      customClient: [null, [Validators.required]],
      semantic: [this.cryptocurrency.DEFAULT_SEMANTIC, [Validators.required]],
      format: ['json', [Validators.required]]
    });
  }

  updateFormGroup(key: string, value: any, emitEvent: boolean = true, timeout: number = 0): void {
    if (timeout > 0) {
      setTimeout(() => {
        this.dumpsFormGroup.get(key)?.setValue(value, { emitEvent: emitEvent });
        this.changeDetectorRef.markForCheck();
      }, timeout);
    } else {
      this.dumpsFormGroup.get(key)?.setValue(value, { emitEvent: emitEvent });
      this.changeDetectorRef.markForCheck();
    }
  }

  updateFormInclude(hd: string, symbol: string, emitEvent: boolean = true, timeout: number = 0) {
    if (hd === 'BIP32') {
      this.updateFormGroup('include', 'at:path,addresses:p2pkh,public-key,wif', emitEvent, timeout);
    } else if (['BIP44', 'BIP49', 'BIP84', 'BIP86'].includes(hd)) {
      this.updateFormGroup('include', 'at:path,address,public-key,wif', emitEvent, timeout);
    } else if (hd === 'BIP141') {
      this.updateFormGroup('include', 'at:path,addresses:p2wpkh,public-key,wif', emitEvent, timeout);
    } else if (hd === 'Cardano') {
      this.updateFormGroup('include', 'at:path,address,public-key,private-key', emitEvent, timeout);
    } else if (['Electrum-V1', 'Electrum-V2'].includes(hd)) {
      this.updateFormGroup('include', 'at:change,at:address,address,public-key,wif', emitEvent, timeout);
    } else if (hd === 'Monero') {
      this.updateFormGroup('include', 'at:minor,at:major,sub-address', emitEvent, timeout);
    }
    if (['ETH', 'ARB', 'OP', 'XDC'].includes(symbol)) {
      this.updateFormGroup('include', 'at:path,address,public-key,private-key', emitEvent, timeout);
    } else if (['BCH', 'SLP', 'XEC'].includes(symbol)) {
      this.updateFormGroup('include', 'at:path,addresses:legacy-p2pkh,public-key,wif', emitEvent, timeout);
    } else if (symbol === 'AVAX') {
      this.updateFormGroup('include', 'at:path,addresses:p-chain,public-key,wif', emitEvent, timeout);
    } else if (symbol === 'BNB') {
      this.updateFormGroup('include', 'at:path,addresses:chain,public-key,private-key', emitEvent, timeout);
    }
  }

  updateSymbol(symbol: string, emitEvent: boolean = true, timeout: number = 0): void {
    this.symbol = symbol;
    this.cryptocurrency = getCryptocurrency(this.symbol);
    this.router.navigate(['dumps', toLowerCase(this.ecc), this.cryptocurrency.SYMBOL], { replaceUrl: true });
    this.networks = this.getNetworks(this.cryptocurrency.SYMBOL);
    this.hds = this.getHDs(this.cryptocurrency.SYMBOL);
    this.hd = objectIsIncluded(this.hds, this.hd) ? this.hd : {
      name: this.cryptocurrency.DEFAULT_HD, value: this.cryptocurrency.DEFAULT_HD
    };
    this.froms = this.getFroms(this.hd.value);
    this.from = objectIsIncluded(this.froms, this.from) ? this.from : this.froms[1];
    this.currentAllowedDerivations = getAllowedDerivations(this.hd.value, this.from.value);
    this.publicKeyTypes = this.getPublicKeyTypes(this.hd.value);
    this.cardanoTypes = this.getCardanoTypes(this.from.value);
    this.clients = this.getClients(this.hd.value, this.symbol, this.from.value);
    this.languages = this.getLanguages(this.clients[0].value);
    this.updateFormGroup('network', this.cryptocurrency.DEFAULT_NETWORK.NAME, emitEvent, timeout);
    this.updateFormGroup('hd', this.hd.value, emitEvent, timeout);
    this.updateFormGroup('from', this.from.value, emitEvent, timeout);
    this.updateFormGroup('client', this.clients[0].value, emitEvent, timeout);

    if (this.symbol == 'ADA') {
      this.updateFormGroup('derivation', 'CIP1852', emitEvent, timeout);
    } else {
      this.updateFormGroup('derivation', this.currentAllowedDerivations[0], emitEvent, timeout);
    }
    this.updateFormInclude(this.hd.value, this.symbol, emitEvent, timeout);
  }

  updateHD(hd: string, emitEvent: boolean = true, timeout: number = 0): void {
    this.hd = { name: hd, value: hd };
    this.froms = this.getFroms(this.hd.value);
    this.from = objectIsIncluded(this.froms, this.from) ? this.from : this.froms[1];
    this.currentAllowedDerivations = getAllowedDerivations(this.hd.value, this.from.value);
    this.publicKeyTypes = this.getPublicKeyTypes(this.hd.value);
    this.cardanoTypes = this.getCardanoTypes(this.from.value);
    this.clients = this.getClients(this.hd.value, this.symbol, this.from.value);
    this.languages = this.getLanguages(this.clients[0].value);
    this.updateFormGroup('client', this.clients[0].value, emitEvent, timeout);
    this.updateFormGroup('from', this.from.value, emitEvent, timeout);
    if (this.symbol == 'ADA') {
      this.updateFormGroup('derivation', 'CIP1852', emitEvent, timeout);
    } else {
      this.updateFormGroup('derivation', this.currentAllowedDerivations[0], emitEvent, timeout);
    }
    this.updateFormGroup('change', ['Electrum-V1', 'Electrum-V2'].includes(this.hd.value) ? '0' : 'external-chain', emitEvent, timeout);
    this.updateFormGroup('publicKeyType', ['Electrum-V1', 'Electrum-V2'].includes(this.hd.value) ? 'uncompressed' : 'compressed', emitEvent, timeout);
    this.updateFormGroup('cardanoType', this.hd.value === 'Cardano' ? 'shelley-icarus' : null, emitEvent, timeout);
    this.updateFormGroup('addressType', this.hd.value === 'Cardano' ? 'payment' : null, emitEvent, timeout);
    this.semantics = this.getSemantics(this.hd.value);
    this.updateFormGroup('semantic', this.hd.value === 'BIP141' ? 'p2wpkh' : this.cryptocurrency.DEFAULT_SEMANTIC, emitEvent, timeout);
    this.updateFormInclude(this.hd.value, this.symbol, emitEvent, timeout);
  }

  updateFrom(from: string, emitEvent: boolean = true, timeout: number = 0): void {
    this.from = this.changeFromString2HDWCombobox(from);
    this.currentAllowedDerivations = getAllowedDerivations(this.dumpsFormGroup.get('hd')?.value, this.from.value);
    this.cardanoTypes = this.getCardanoTypes(this.from.value);
    this.clients = this.getClients(this.hd.value, this.symbol, this.from.value);
    this.languages = this.getLanguages(this.clients[0].value);
    this.updateFormGroup('client', this.clients[0].value, emitEvent, timeout);
    if (this.dumpsFormGroup.get('symbol')?.value == 'ADA') {
      this.updateFormGroup('derivation', 'CIP1852', emitEvent, timeout);
    } else {
      this.updateFormGroup('derivation', this.currentAllowedDerivations[0], emitEvent, timeout);
    }
    if (this.dumpsFormGroup.get('symbol')?.value === 'ADA') {
      this.updateFormGroup('client', this.from.value === 'cardano-seed' ? 'Cardano' : 'BIP39', emitEvent, timeout);
    }
    if (['bip-wif', 'bip-private-key', 'bip-public-key', 'cardano-private-key', 'cardano-public-key'].includes(this.from.value)) {
      this.updateFormGroup('format', 'json', emitEvent, timeout);
    }
  }

  updateCardanoType(cardanoType: string, emitEvent: boolean = true, timeout: number = 0): void {
    this.updateFormGroup('addressType', ['shelley-icarus', 'shelley-ledger'].includes(cardanoType) ? 'payment' : null, emitEvent, timeout);
  }

  ngOnInit(): void {
    this.dumpsFormGroup.get('symbol')?.valueChanges.subscribe((symbol: string) => { this.updateSymbol(symbol, true, 1); });
    this.dumpsFormGroup.get('hd')?.valueChanges.subscribe((hd: string) => { this.updateHD(hd, true, 1); });
    this.dumpsFormGroup.get('from')?.valueChanges.subscribe((from: string) => {  this.updateFrom(from, true, 1); });
    this.dumpsFormGroup.get('cardanoType')?.valueChanges.subscribe((cardanoType: string) => { this.updateCardanoType(cardanoType, true, 1); });
    this.dumpsFormGroup.get('client')?.valueChanges.subscribe((client: string) => { this.languages = this.getLanguages(client); });
    this.dumpsFormGroup.get('customClient')?.valueChanges.subscribe((customClient: string) => { this.updateFormGroup('path', customClient, true, 1); });
    this.dumpsFormGroup.get('derivation')?.valueChanges.subscribe((derivation: string) => {
      this.dumpsFormGroup.get('change')?.setValidators(
        derivation === 'Electrum' ? [Validators.required, Validators.pattern(/^\d+(-\d+)?$/), this.indexValidator] : [Validators.required]
      );
      this.dumpsFormGroup.get('change')?.updateValueAndValidity();
    });
    if (this.storageService.getStorage('disclaimer') !== 'true') {
      if (this.router.url.startsWith('/dumps')) {
        this.storageService.setStorage('action', this.router.url.slice(1).toString());
        this.router.navigateByUrl(this.router.url);
      }
    } else {
      this.initFromURL();
    }
  }

  initFromURL(ECC?: string, SYMBOL?: string): void {
    let default_ecc: string = this.ecc;
    let default_symbol: string = this.symbol;
    this.activatedRoute.paramMap.pipe(take(1)).subscribe((params: ParamMap) => {
      let ecc: string | undefined = ECC ? ECC : params.get('ecc')?.toString();
      let symbol: string | undefined = SYMBOL ? SYMBOL : params.get('symbol')?.toString();
      this.ecc = toTitleCase(ecc || default_ecc);
      if (this.ecc === 'Kholaw-Ed25519') {
        default_symbol = 'ADA';
      } else if (this.ecc === 'SLIP10-Ed25519') {
        default_symbol = 'ALGO';
      } else if (this.ecc === 'SLIP10-Ed25519-Blake2b') {
        default_symbol = 'XNO';
      } else if (this.ecc === 'SLIP10-Ed25519-Monero') {
        default_symbol = 'XMR';
      } else if (this.ecc === 'SLIP10-Nist256p1') {
        default_symbol = 'NEO';
      } else if (['ALL', 'SLIP10-Secp256k1'].includes(this.ecc)) {
        default_symbol = 'BTC';
      } else {
        this.ecc = default_ecc;
        setTimeout((): void => { this.terminalService.update(`Unknown '${ecc}' ECC, defaulting to '${this.ecc}'`, 'warning'); }, 10)
        this.groupBoxService.update('cryptocurrency', 'warning');
      }
      this.symbols = this.getSymbols(this.ecc);
      this.cryptocurrency = getCryptocurrency(toUpperCase(symbol || default_symbol));
      if (!this.cryptocurrency) {
        this.cryptocurrency = getCryptocurrency(default_symbol);
        setTimeout((): void => { this.terminalService.update(`Unknown '${symbol}' symbol, defaulting to '${this.cryptocurrency.SYMBOL}'`, 'warning'); }, 10)
        this.groupBoxService.update('cryptocurrency', 'warning');
      } else if (this.ecc !== 'ALL' && this.cryptocurrency.ECC.NAME !== this.ecc) {
        this.cryptocurrency = getCryptocurrency(default_symbol);
        setTimeout((): void => { this.terminalService.update(`Unsupported '${symbol}' symbol by ${this.ecc} ECC, defaulting to '${this.cryptocurrency.SYMBOL}'`, 'warning'); }, 10)
        this.groupBoxService.update('cryptocurrency', 'warning');
      }
      this.updateFormGroup('symbol', this.cryptocurrency.SYMBOL, false);
      this.updateSymbol(this.cryptocurrency.SYMBOL, false, 0);
      this.activatedRoute.queryParams.pipe(take(1)).subscribe((queries: Params) => {
        let queryParams: DictionaryInterface = replaceUnderscore2Hyphen(queries);
        for (let key of ['network', 'hd', 'from', 'derivation', 'format']) { queryParams = this.setQueryValues(queryParams, key); }
        for (let key of this.getFromControls(this.dumpsFormGroup.get('from')?.value)) { queryParams = this.setQueryValues(queryParams, this.normalizeKey(key)); }
        for (let key of this.getDerivationControls(this.dumpsFormGroup.get('derivation')?.value, this.dumpsFormGroup.get('from')?.value)) { queryParams = this.setQueryValues(queryParams, this.normalizeKey(key)); }
        for (let key of this.getActionControls(this.dumpsFormGroup.get('format')?.value)) { queryParams = this.setQueryValues(queryParams, this.normalizeKey(key)); }
        for (let key of ['generate', 'save', 'clear']) { queryParams = this.setQueryValues(queryParams, key); }
        this.router.navigate(
          ['dumps', toLowerCase(this.ecc), this.cryptocurrency.SYMBOL], {
            queryParams: queryParams, replaceUrl: true
          }
        );
      });
    });
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
    // Reverse
    if (key === 'mnemonic-type') return 'mnemonicType';
    if (key === 'xprivate-key') return 'xprivateKey';
    if (key === 'xpublic-key') return 'xpublicKey';
    if (key === 'private-key') return 'privateKey';
    if (key === 'public-key') return 'publicKey';
    if (key === 'spend-private-key') return 'spendPrivateKey';
    if (key === 'view-private-key') return 'viewPrivateKey';
    if (key === 'spend-public-key') return 'spendPublicKey';
    if (key === 'public-key-type') return 'publicKeyType';
    if (key === 'payment-id') return 'paymentID';
    if (key === 'cardano-type') return 'cardanoType';
    if (key === 'address-type') return 'addressType';
    if (key === 'staking-public-key') return 'stakingPublicKey';
    if (key === 'custom-client') return 'customClient';
    return key.toLowerCase();
  }

  getNetworks(symbol: string): ComboboxInterface[] {
    return CRYPTOCURRENCIES.getClasses().find(
      (item: typeof Cryptocurrency): boolean => item.SYMBOL === symbol
    )?.NETWORKS.getNetworks().map((item: string): ComboboxInterface => ({
        name: toTitleCase(item), value: item
    })) || [];
  }

  getHDs(symbol: string): ComboboxInterface[] {
    return CRYPTOCURRENCIES.getClasses().find(
      (item: typeof Cryptocurrency): boolean => item.SYMBOL === symbol
    )?.HDS.getHDS().map((item: string): ComboboxInterface => ({
        name: item, value: item
    })) || [];
  }

  getFroms(hd: string): ComboboxInterface[] {
    if (['BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'BIP141'].includes(hd)) {
      let forms: ComboboxInterface[] = [
        { name: 'Entropy', value: 'bip-entropy' },
        { name: 'Mnemonic', value: 'bip-mnemonic' },
        { name: 'Private Key', value: 'bip-private-key' },
        { name: 'Public Key', value: 'bip-public-key' },
        { name: 'Seed', value: 'bip-seed' },
        { name: 'WIF', value: 'bip-wif' },
        { name: 'XPrivate Key', value: 'bip-xprivate-key' }
      ];
      if (['BIP32', 'BIP141'].includes(hd)) {
        forms.push({ name: 'XPublic Key', value: 'bip-xpublic-key'})
      }
      return forms;
    } else if (hd === 'Cardano') {
      return [
        { name: 'Entropy', value: 'cardano-entropy' },
        { name: 'Mnemonic', value: 'cardano-mnemonic' },
        { name: 'Private Key', value: 'cardano-private-key' },
        { name: 'Public Key', value: 'cardano-public-key' },
        { name: 'Seed', value: 'cardano-seed' },
        { name: 'XPrivate Key', value: 'cardano-xprivate-key' },
        { name: 'XPublic Key', value: 'cardano-xpublic-key' }
      ];
    } else if (hd === 'Electrum-V1') {
      return [
        { name: 'Entropy', value: 'electrum-v1-entropy' },
        { name: 'Mnemonic', value: 'electrum-v1-mnemonic' },
        { name: 'Private Key', value: 'electrum-v1-private-key' },
        { name: 'Public Key', value: 'electrum-v1-public-key' },
        { name: 'Seed', value: 'electrum-v1-seed' },
        { name: 'WIF', value: 'electrum-v1-wif' }
      ];
    } else if (hd === 'Electrum-V2') {
      return [
        { name: 'Entropy', value: 'electrum-v2-entropy' },
        { name: 'Mnemonic', value: 'electrum-v2-mnemonic' },
        { name: 'Seed', value: 'electrum-v2-seed' }
      ];
    } else if (hd === 'Monero') {
      return [
        { name: 'Entropy', value: 'monero-entropy' },
        { name: 'Mnemonic', value: 'monero-mnemonic' },
        { name: 'Private Key', value: 'monero-private-key' },
        { name: 'Seed', value: 'monero-seed'},
        { name: 'Spend Private Key', value: 'monero-spend-private-key' },
        { name: 'Watch Only', value: 'monero-watch-only' }
      ];
    }
    return [];
  }

  changeFromString2HDWCombobox(from: string): ComboboxInterface {
    let tempFrom: ComboboxInterface = { name: 'Null', value: null };
    for (let hd of ['BIP32', 'Cardano', 'Electrum-V1', 'Electrum-V2', 'Monero']) {
      for (let item of this.getFroms(hd)) {
        if (item.value === from) {
          tempFrom = item;
        }
      }
    }
    return tempFrom;
  }

  getNormalizedFroms(hd: string): string[] {
    return this.getFroms(hd).map((item: ComboboxInterface) => item.value);
  }

  getFromGroupBoxName(from: string, hd: string): string | null {
    if (['bip32', 'bip44', 'bip49', 'bip84', 'bip86', 'bip141'].includes(hd.toLowerCase())) {
      return `bip-${from.toLowerCase()}`;
    } else if ('cardano' === hd.toLowerCase()) {
      return `cardano-${from.toLowerCase()}`;
    } else if ('electrum-v1' === hd.toLowerCase()) {
      return `electrum-v1-${from.toLowerCase()}`;
    } else if ('electrum-v2' === hd.toLowerCase()) {
      return `electrum-v2-${from.toLowerCase()}`;
    } else if ('monero' === hd.toLowerCase()) {
      return `monero-${from.toLowerCase()}`;
    } else {
      return null;
    }
  }

  setQueryValues(queries: DictionaryInterface, key: string): DictionaryInterface {
    const queryParams = { ...queries };
    const symbol: string = this.dumpsFormGroup.get('symbol')?.value
    const hd: string = queryParams['hd'] ? queryParams['hd'] : this.dumpsFormGroup.get('hd')?.value
    const from: string = queryParams['from'] ? this.getFromGroupBoxName(queryParams['from'], hd) : this.dumpsFormGroup.get('from')?.value
    const client: string = queryParams['client'] ? queryParams['client'] : this.dumpsFormGroup.get('client')?.value
    const cardanoType: string = queryParams['cardanoType'] ? queryParams['cardanoType'] : this.dumpsFormGroup.get('cardanoType')?.value
    const derivation: string = queryParams['derivation'] ? queryParams['derivation'] : this.dumpsFormGroup.get('derivation')?.value
    if (key === 'network' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      if (this.cryptocurrency.NETWORKS.getNetworks().includes(queryParams[key])) {
        this.updateFormGroup('network', queryParams[key], true);
      } else {
        queryParams[key] = this.cryptocurrency.DEFAULT_NETWORK.NAME;
        this.updateFormGroup('network', queryParams[key], true);
        this.terminalService.update(
          `Unsupported '${queries[key]}' network by ${symbol} symbol, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update('cryptocurrency', 'warning');
      }
    } else if (key === 'hd' && queryParams[key]) {
      queryParams[key] = toTitleCase(queryParams[key]);
      if (this.cryptocurrency.HDS.getHDS().includes(queryParams[key])) {
        this.updateFormGroup('hd', queryParams[key], false);
        this.updateHD(queryParams[key], false, 0);
      } else {
        queryParams[key] = this.hd.value;
        this.updateFormGroup('hd', queryParams[key], false);
        this.updateHD(queryParams[key], false, 0);
        this.terminalService.update(
          `Unsupported '${queries[key]}' HD by '${symbol}' symbol, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update('cryptocurrency', 'warning');
      }
    } else if (key === 'from' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      const froms: string[] = this.getNormalizedFroms(hd);
      const from: string | null = this.getFromGroupBoxName(queryParams[key], hd);
      if (from && froms.includes(from)) {
        this.updateFormGroup('from', from, false);
        this.updateFrom(from, false, 0);
      } else {
        queryParams[key] = this.getFromNormalize(froms[1]);
        this.updateFormGroup('from', froms[1], false);
        this.updateFrom(froms[1], false, 0);
        this.terminalService.update(
          `Unsupported '${queries[key]}' from by '${hd}' HD, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update('cryptocurrency', 'warning');
      }
    } else if (key === 'client' && queryParams[key]) {
      queryParams[key] = toTitleCase(queryParams[key]);
      const clients: string[] = this.clients.map(
        (item: ComboboxInterface) => item.value
      );
      if (clients.includes(queryParams[key])) {
        this.updateFormGroup('client', queryParams[key], true);
      } else {
        queryParams[key] = clients[0];
        this.updateFormGroup('client', queryParams[key], true);
        this.terminalService.update(
          `Unknown '${queries[key]}' client by ${hd} HD, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update(from, 'warning');
      }
    } else if (key === 'mnemonic-type' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      if (mnemonicTypes.includes(queryParams[key])) {
        this.updateFormGroup('mnemonicType', queryParams[key], true);
      } else {
        queryParams[key] = mnemonicTypes[0];
        this.updateFormGroup('mnemonicType', queryParams[key], true);
        this.terminalService.update(
          `Unknown '${queries[key]}' mnemonic type, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update(from, 'warning');
      }
    } else if (key === 'language' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      const languages: string[] = this.getLanguages(client).map(
        (item: ComboboxInterface) => item.value
      );
      if (languages.includes(queryParams[key])) {
        this.updateFormGroup('language', queryParams[key], true);
      } else {
        queryParams[key] = 'english';
        this.updateFormGroup('language', queryParams[key], true);
        this.terminalService.update(
          `Unsupported '${queries[key]}' language by '${client}' client, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update(from, 'warning');
      }
    } else if (key === 'public-key-type' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      const publicKeyTypes: string[] = this.getPublicKeyTypes(hd).map(
        (item: ComboboxInterface) => item.value
      );
      if (publicKeyTypes.includes(queryParams[key])) {
        this.updateFormGroup('publicKeyType', queryParams[key], true);
      } else {
        queryParams[key] = publicKeyTypes[0];
        this.updateFormGroup('publicKeyType', queryParams[key], true);
        this.terminalService.update(
          `Wrong '${queries[key]}' public key type by ${hd} HD, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update(from, 'warning');
      }
    } else if (key === 'mode' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      if (modes.includes(queryParams[key])) {
        this.updateFormGroup('mode', queryParams[key], true);
      } else {
        queryParams[key] = 'standard';
        this.updateFormGroup('mode', queryParams[key], true);
        this.terminalService.update(
          `Unknown '${queries[key]}' mode, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update(from, 'warning');
      }
    } else if (key === 'cardano-type' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      const cardanoTypes: string[] = this.getCardanoTypes(from).map(
        (item: ComboboxInterface) => item.value
      );
      if (cardanoTypes.includes(queryParams[key])) {
        this.updateFormGroup('cardanoType', queryParams[key], false);
        this.updateCardanoType(queryParams[key], false, 0);
      } else {
        queryParams[key] = 'shelley-icarus';
        this.updateFormGroup('cardanoType', queryParams[key], false);
        this.updateCardanoType(queryParams[key], false, 0);
        this.terminalService.update(
          `Unknown '${queries[key]}' cardano type, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update(from, 'warning');
      }
    } else if (key === 'address-type' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      if (addressTypes.includes(queryParams[key])) {
        this.updateFormGroup('addressType', queryParams[key], true);
      } else {
        queryParams[key] = 'payment';
        this.updateFormGroup('addressType', queryParams[key], true);
        this.terminalService.update(
          `Wrong '${queries[key]}' address type for '${cardanoType}' cardano type, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update(from, 'warning');
      }
    } else if (key === 'derivation' && queryParams[key]) {
      queryParams[key] = toTitleCase(queryParams[key]);
      if (this.currentAllowedDerivations.includes(queryParams[key])) {
        this.updateFormGroup('derivation', queryParams[key], true);
      } else {
        queryParams[key] = symbol == 'ADA' ? 'CIP1852' : this.currentAllowedDerivations[0];
        this.updateFormGroup('derivation', queryParams[key], true);
        if (this.derivations.includes(toTitleCase(queries[key]))) {
          this.terminalService.update(
            `This '${queries[key]}' derivation not allowed for '${hd}' HD, defaulting to '${queryParams[key]}'`, 'warning'
          );
          this.groupBoxService.update('derivation', 'warning');
        } else {
          this.terminalService.update(
            `Wrong '${queries[key]}' derivation for '${hd}' HD, defaulting to '${queryParams[key]}'`, 'warning'
          );
          this.groupBoxService.update('derivation', 'warning');
        }
      }
    } else if (key === 'change' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      if (derivation !== 'Electrum') {
        const changes: string[] = this.changes.map(
          (item: ComboboxInterface) => item.value
        );
        if (changes.includes(queryParams[key])) {
          this.updateFormGroup('change', queryParams[key], true);
        } else {
          queryParams[key] = 'external-chain';
          this.updateFormGroup('change', queryParams[key], true);
          this.terminalService.update(
            `Wrong '${queries[key]}' change for '${derivation}' derivation, defaulting to '${queryParams[key]}'`, 'warning'
          );
          this.groupBoxService.update('derivation', 'warning');
        }
      } else {
        this.updateFormGroup('change', queryParams[key], true);
      }
    } else if (key === 'role' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      const roles: string[] = this.roles.map(
          (item: ComboboxInterface) => item.value
        );
      if (roles.includes(queryParams[key])) {
        this.updateFormGroup('role', queryParams[key], true);
      } else {
        queryParams[key] = 'external-chain';
        this.updateFormGroup('role', queryParams[key], true);
        this.terminalService.update(
          `Wrong '${queries[key]}' role for '${derivation}' derivation, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update('derivation', 'warning');
      }
    } else if (key === 'semantic' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key], /_/g, '-');
      const semantics: string[] = this.semantics.map(
        (item: ComboboxInterface) => item.value
      );
      if (semantics.includes(queryParams[key])) {
        this.updateFormGroup('semantic', queryParams[key], true);
      } else {
        queryParams[key] = hd === 'BIP141' ? 'p2wpkh' : this.cryptocurrency.DEFAULT_SEMANTIC;
        this.updateFormGroup('semantic', queryParams[key], true);
        this.terminalService.update(
          `Invalid '${queries[key]}' semantic, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update(from, 'warning');
      }
    } else if (key === 'format' && queryParams[key]) {
      queryParams[key] = toUpperCase(queryParams[key]);
      const formats: string[] = this.formats.map(
        (item: ComboboxInterface) => item.name
      );
      if (formats.includes(queryParams[key])) {
        if (['bip-wif', 'bip-private-key', 'bip-public-key', 'cardano-private-key', 'cardano-public-key'].includes(from)) {
          if (queryParams[key] === 'CSV') {
            queryParams[key] = 'JSON';
            this.terminalService.update(
              `Unacceptable '${queries[key]}' format by ${queries['from']}, setting to '${queryParams[key]}'`, 'warning'
            );
            this.groupBoxService.update('action', 'warning');
          }
        }
        this.updateFormGroup('format', toLowerCase(queryParams[key]), true);
      } else {
        queryParams[key] = 'JSON';
        this.updateFormGroup('format', queryParams[key], true);
        this.terminalService.update(
          `Invalid '${queries[key]}' format, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update('action', 'warning');
      }
    } else if (key === 'strict' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      if (['true', 'false'].includes(queryParams[key])) {
        this.updateFormGroup('strict', queryParams[key] === 'true', true);
      } else {
        queryParams[key] = true;
        this.updateFormGroup('strict', queryParams[key], true);
        this.terminalService.update(
          `Invalid '${queries[key]}' strict, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update(from, 'warning');
      }
    } else if (key === 'bip38' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      if (['true', 'false'].includes(queryParams[key])) {
        this.updateFormGroup('bip38', queryParams[key] === 'true', true);
      } else {
        queryParams[key] = false;
        this.updateFormGroup('bip38', queryParams[key], true);
        this.terminalService.update(
          `Invalid '${queries[key]}' bip38, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update(from, 'warning');
      }
    } else if (key === 'generate' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      if (['true', 'false'].includes(queryParams[key])) {
        if (queryParams[key] === 'true') {
          setTimeout(() => { this.getDumps(this.dumpsFormGroup.value, 'generate') }, 10);
        }
      } else {
        queryParams[key] = false;
        this.terminalService.update(
          `Invalid '${queries[key]}' generate, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update('action', 'warning');
      }
    } else if (key === 'save' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      if (['true', 'false'].includes(queryParams[key])) {
        if (queryParams[key] === 'true') {
          setTimeout(() => { this.getDumps(this.dumpsFormGroup.value, 'save') }, 10);
        }
      } else {
        queryParams[key] = false;
        this.terminalService.update(
          `Invalid '${queries[key]}' save, defaulting to '${queryParams[key]}'`, 'warning'
        );
        this.groupBoxService.update('action', 'warning');
      }
    } else if (key === 'clear' && queryParams[key]) {
      queryParams[key] = toLowerCase(queryParams[key]);
      if (['true', 'false'].includes(queryParams[key])) {
        if (queryParams[key] === 'true') {
          // On terminal component
        }
      } else {
        queryParams[key] = false;
        this.terminalService.update(
          `Invalid '${queries[key]}' clear, defaulting to '${queryParams[key]}'`, 'warning'
        );
      }
    } else if ([
      'entropy', 'mnemonic', 'seed', 'xprivate-key', 'xpublic-key', 'private-key', 'wif', 'public-key', 'spend-private-key', 'view-private-key',
      'spend-public-key', 'account', 'address', 'minor', 'major', 'path', 'passphrase', 'payment-id', 'staking-public-key', 'exclude', 'include'
    ].includes(key) && queryParams[key]) {
      this.updateFormGroup(this.normalizeKey(key), queryParams[key], true);
    }
    return queryParams;
  }

  getFromNormalize(value: string): string {
    if (['bip-entropy', 'cardano-entropy', 'electrum-v1-entropy', 'electrum-v2-entropy', 'monero-entropy'].includes(value)) {
      return 'entropy';
    } else if (['bip-mnemonic', 'cardano-mnemonic', 'electrum-v1-mnemonic', 'electrum-v2-mnemonic', 'monero-mnemonic'].includes(value)) {
      return 'mnemonic';
    } else if (['bip-private-key', 'cardano-private-key', 'electrum-v1-private-key', 'monero-private-key'].includes(value)) {
      return 'private-key';
    } else if (['bip-public-key', 'cardano-public-key', 'electrum-v1-public-key'].includes(value)) {
      return 'public-key';
    } else if (['bip-seed', 'cardano-seed', 'electrum-v1-seed', 'electrum-v2-seed', 'monero-seed'].includes(value)) {
      return 'seed';
    } else if (['bip-wif', 'electrum-v1-wif'].includes(value)) {
      return 'wif';
    } else if (['bip-xprivate-key', 'cardano-xprivate-key'].includes(value)) {
      return 'xprivate-key';
    } else if (['bip-xpublic-key', 'cardano-xpublic-key'].includes(value)) {
      return 'xpublic-key';
    } else if (value === 'monero-spend-private-key') {
      return 'spend-private-key';
    } else if (value === 'monero-watch-only') {
      return 'watch-only';
    } else {
      return value;
    }
  }

  getLanguages(client: string): ComboboxInterface[] {
    return MNEMONICS.getClasses().find(
      (item: typeof Mnemonic) => item.getName() === client
    )?.languages.map((item: string): ComboboxInterface => ({
      name: toTitleCase(item), value: item
    })) || [];
  }

  getPublicKeyTypes(hd: string): ComboboxInterface[] {
    const types: ComboboxInterface[] = publicKeyTypes.map(
      (item: string): ComboboxInterface => ({name: toTitleCase(item), value: item})
    );
    const reversedTypes: ComboboxInterface[] = types.reverse();
    return ['Electrum-V1', 'Electrum-V2'].includes(hd) ? reversedTypes : types;
  }

  getCardanoTypes(from: string): ComboboxInterface[] {
    const types: ComboboxInterface[] = cardanoTypes.map(
      (item: string): ComboboxInterface => ({name: toTitleCase(item), value: item})
    );
    return ['cardano-private-key', 'cardano-public-key'].includes(from) ? [types[3], types[4]] : types;
  }

  getClients(hd: string, symbol: string, from: string): ComboboxInterface[] {
    const data: ComboboxInterface[] = clients.map(
      (item: string): ComboboxInterface => ({name: item, value: item})
    );
    if (['BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'BIP141'].includes(hd)) {
      if (symbol === 'ALGO') {
        return [data[0], data[1]];
      } else {
        return [data[1]];
      }
    } else if (hd === 'Cardano') {
      if (from === 'cardano-seed') {
        return [data[2]];
      } else {
        return [data[1]];
      }
    } else if (hd === 'Electrum-V1') {
      return [data[3]];
    } else if (hd === 'Electrum-V2') {
      return [data[4]];
    } else if (hd === 'Monero') {
      return [data[5]];
    }
    return [];
  }

  ngAfterViewInit(): void {
    this.checkOverflow();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkOverflow();
  }

  checkOverflow(): void {
    const customActionsElement = this.elementRef.nativeElement.querySelector('#customActions');
    const customDerivationElement = this.elementRef.nativeElement.querySelector('#customDerivation');
    this.isOverflowed = (
      customDerivationElement.scrollWidth > customActionsElement.clientWidth
    );
    this.renderer2.setStyle(
      customDerivationElement, 'max-width', this.isOverflowed ? `${customActionsElement.clientWidth - 56}px` : `${customActionsElement.clientWidth}px`
    );
    this.changeDetectorRef.detectChanges();
  }

  scrollLeft(): void {
    const customDerivationElement = this.elementRef.nativeElement.querySelector('#customDerivation');
    if (customDerivationElement.scrollLeft <= 100) {
      customDerivationElement.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    customDerivationElement.scrollBy({ left: -150, behavior: 'smooth' });
  }

  scrollRight(): void {
    const customDerivationElement = this.elementRef.nativeElement.querySelector('#customDerivation');
    const maxScrollLeft = (
      customDerivationElement.scrollWidth - customDerivationElement.clientWidth - 100
    );
    if (customDerivationElement.scrollLeft >= maxScrollLeft) {
      customDerivationElement.scrollTo({
        left: customDerivationElement.scrollWidth - customDerivationElement.clientWidth, behavior: 'smooth'
      });
      return;
    }
    customDerivationElement.scrollBy({ left: 150, behavior: 'smooth' });
  }

  isInvalid(controls: string[]): boolean {
    for (const name of controls) {
      const control: AbstractControl<any, any> | null = this.dumpsFormGroup.get(name);
      if (control?.invalid && control.errors) {
        if (control.errors['required']) {
          this.terminalService.update(`${toTitleCase(toLowerCase(this.normalizeKey(name), /_/g, '-'), /-/g, ' ')} is required`, 'error');
        }
        if (control.errors['minlength']) {
          this.terminalService.update(`${toTitleCase(toLowerCase(this.normalizeKey(name), /_/g, '-'), /-/g, ' ')} must be at least ${control.errors['minlength'].requiredLength} characters long`, 'error');
        }
        if (control.errors['maxlength']) {
          this.terminalService.update(`${toTitleCase(toLowerCase(this.normalizeKey(name), /_/g, '-'), /-/g, ' ')} must be no more than ${control.errors['maxlength'].requiredLength} characters long`, 'error');
        }
        if (control.errors['pattern']) {
          this.terminalService.update(`${toTitleCase(toLowerCase(this.normalizeKey(name), /_/g, '-'), /-/g, ' ')} has an invalid format`, 'error');
        }
        if (control.errors['comparison']) {
          this.terminalService.update(
            `Invalid format for ${toTitleCase(toLowerCase(this.normalizeKey(name), /_/g, '-'), /-/g, ' ')}: the second value (${control.errors['comparison'].secondNumber}) must be less than the first value (${control.errors['comparison'].firstNumber}).`, 'error'
          );
        }
        return true;
      }
    }
    return false;
  }

  getFromControls(from: string): string[] {
    let controls: string[] = [];
    if (from === 'bip-entropy') {
      controls = ['client', 'entropy', 'language', 'publicKeyType', 'semantic'];
    } else if (from === 'bip-mnemonic') {
      controls = ['client', 'mnemonic', 'publicKeyType', 'semantic'];
    } else if (from === 'bip-private-key') {
      controls = ['privateKey', 'publicKeyType', 'semantic'];
    } else if (from === 'bip-public-key') {
      controls = ['publicKey', 'publicKeyType', 'semantic'];
    } else if (from === 'bip-seed') {
      controls = ['client', 'seed', 'publicKeyType', 'semantic'];
    } else if (from === 'bip-wif') {
      controls = ['wif', 'bip38', 'publicKeyType', 'semantic'];
      if (this.dumpsFormGroup.get('bip38')?.value) { controls.push('passphrase'); }
    } else if (from === 'bip-xprivate-key') {
      controls = ['xprivateKey', 'strict', 'publicKeyType', 'semantic'];
    } else if (from === 'bip-xpublic-key') {
      controls = ['xpublicKey', 'strict', 'publicKeyType', 'semantic'];
    } else if (from === 'cardano-entropy') {
      controls = ['client', 'entropy', 'cardanoType', 'language'];
      if (['shelley-icarus', 'shelley-ledger'].includes(this.dumpsFormGroup.get('cardanoType')?.value)) {
        if (this.dumpsFormGroup.get('addressType')?.value === 'payment') {
          controls.push('stakingPublicKey');
        }
        controls.push('addressType');
      }
    } else if (from === 'cardano-mnemonic') {
      controls = ['client', 'mnemonic', 'cardanoType'];
      if (['shelley-icarus', 'shelley-ledger'].includes(this.dumpsFormGroup.get('cardanoType')?.value)) {
        if (this.dumpsFormGroup.get('addressType')?.value === 'payment') {
          controls.push('stakingPublicKey');
        }
        controls.push('addressType');
      }
    } else if (from === 'cardano-private-key') {
      controls = ['privateKey', 'cardanoType'];
      if (['shelley-icarus', 'shelley-ledger'].includes(this.dumpsFormGroup.get('cardanoType')?.value)) {
        if (this.dumpsFormGroup.get('addressType')?.value === 'payment') {
          controls.push('stakingPublicKey');
        }
        controls.push('addressType');
      }
    } else if (from === 'cardano-public-key') {
      controls = ['publicKey', 'cardanoType'];
      if (['shelley-icarus', 'shelley-ledger'].includes(this.dumpsFormGroup.get('cardanoType')?.value)) {
        if (this.dumpsFormGroup.get('addressType')?.value === 'payment') {
          controls.push('stakingPublicKey');
        }
        controls.push('addressType');
      }
    } else if (from === 'cardano-seed') {
      controls = ['client', 'seed', 'cardanoType'];
      if (['shelley-icarus', 'shelley-ledger'].includes(this.dumpsFormGroup.get('cardanoType')?.value)) {
        if (this.dumpsFormGroup.get('addressType')?.value === 'payment') {
          controls.push('stakingPublicKey');
        }
        controls.push('addressType');
      }
    } else if (from === 'cardano-xprivate-key') {
      controls = ['xprivateKey', 'strict', 'cardanoType'];
      if (['shelley-icarus', 'shelley-ledger'].includes(this.dumpsFormGroup.get('cardanoType')?.value)) {
        if (this.dumpsFormGroup.get('addressType')?.value === 'payment') {
          controls.push('stakingPublicKey');
        }
        controls.push('addressType');
      }
    } else if (from === 'cardano-xpublic-key') {
      controls = ['xpublicKey', 'strict', 'cardanoType'];
      if (['shelley-icarus', 'shelley-ledger'].includes(this.dumpsFormGroup.get('cardanoType')?.value)) {
        if (this.dumpsFormGroup.get('addressType')?.value === 'payment') {
          controls.push('stakingPublicKey');
        }
        controls.push('addressType');
      }
    } else if (from === 'electrum-v1-entropy') {
      controls = ['client', 'entropy', 'language', 'publicKeyType']
    } else if (from === 'electrum-v1-mnemonic') {
      controls = ['client', 'mnemonic', 'publicKeyType']
    } else if (from === 'electrum-v1-private-key') {
      controls = ['privateKey', 'publicKeyType']
    } else if (from === 'electrum-v1-public-key') {
      controls = ['publicKey', 'publicKeyType']
    } else if (from === 'electrum-v1-seed') {
      controls = ['client', 'seed', 'publicKeyType']
    } else if (from === 'electrum-v1-wif') {
      controls = ['wif', 'bip38', 'publicKeyType']
      if (this.dumpsFormGroup.get('bip38')?.value) { controls.push('passphrase'); }
    } else if (from === 'electrum-v2-entropy') {
      controls = ['client', 'entropy', 'mode', 'language', 'mnemonic-type', 'publicKeyType']
    } else if (from === 'electrum-v2-mnemonic') {
      controls = ['client', 'mnemonic', 'mode', 'mnemonic-type', 'publicKeyType']
    }  else if (from === 'electrum-v2-seed') {
      controls = ['client', 'seed', 'mode', 'publicKeyType']
    } else if (from === 'monero-entropy') {
      controls = ['client', 'entropy', 'language', 'paymentID']
    } else if (from === 'monero-mnemonic') {
      controls = ['client', 'mnemonic', 'paymentID']
    } else if (from === 'monero-private-key') {
      controls = ['privateKey', 'paymentID']
    } else if (from === 'monero-seed') {
      controls = ['client', 'seed', 'paymentID']
    } else if (from === 'monero-spend-private-key') {
      controls = ['spendPrivateKey', 'paymentID']
    } else if (from === 'monero-watch-only') {
      controls = ['viewPrivateKey', 'spendPublicKey', 'paymentID']
    }
    return controls;
  }

  getDerivationControls(derivation: string, from: string): string[] {
    let controls: string[] = [];
    if (['bip-wif', 'bip-private-key', 'bip-public-key', 'cardano-private-key', 'cardano-public-key'].includes(from)) {
      return controls;
    } else if (derivation === 'Custom') {
      controls = ['path'];
    } else if (['BIP44', 'BIP49', 'BIP84', 'BIP86'].includes(derivation)) {
      controls = ['account', 'change', 'address'];
    } else if (derivation === 'CIP1852') {
      controls = ['account', 'role', 'address'];
    } else if (derivation === 'Electrum') {
      controls = ['change', 'address'];
    } else if (derivation === 'Monero') {
      controls = ['minor', 'major'];
    } else if (derivation === 'HDW') {
      controls = ['account', 'address'];
    }
    return controls;
  }

  getActionControls(format: string): string[] {
    let controls: string[] = [];
    if (format === 'json') {
      controls = ['exclude'];
    } else if (format === 'csv') {
      controls = ['include'];
    }
    return controls;
  }

  @Output() onShareModalOpen: EventEmitter<any> = new EventEmitter<any>();

  getControlsData(data: DictionaryInterface, controls: string[]): DictionaryInterface {
    let controlsData: DictionaryInterface = { };
    for (const control of controls) {
      controlsData[control] = (data as DictionaryInterface)[control];
    }
    return controlsData;
  }

  share(data: any): void {
    this.onShareModalOpen.emit({
      ecc: this.ecc,
      cryptoECC: this.cryptocurrency.ECC.NAME,
      symbol: this.symbol,
      network: data.network,
      hd: data.hd,
      from: this.getFromNormalize(data.from),
      derivation: data.derivation,
      ...this.getControlsData(data, this.getFromControls(data.from)),
      ...this.getControlsData(data, this.getDerivationControls(data.derivation, data.from)),
      format: data.format,
      ...this.getControlsData(data, this.getActionControls(data.format)),
      generate: true,
      save: true,
      clear: true
    });
  }

  getDumps(data: DumpsInterface, dumpsType: 'generate' | 'save'): any {
    this.isLoading = true;

    if (this.isInvalid(this.getFromControls(data.from))) {
      this.groupBoxService.update(data.from, 'error');
      this.isLoading = false;
      return;
    }
    if (this.isInvalid(this.getDerivationControls(data.derivation, data.from))) {
      this.groupBoxService.update('derivation', 'error');
      this.isLoading = false;
      return;
    }
    if (this.isInvalid(['format', ...this.getActionControls(data.format)])) {
      this.groupBoxService.update('action', 'error');
      this.isLoading = false;
      return;
    }

    let hdwallet: HDWallet;
    const cryptocurrency: typeof Cryptocurrency = getCryptocurrency(data.symbol);
    let semantic = data.semantic;
    if (!semantic) {
      if (['BIP32', 'BIP44', 'BIP86', 'Cardano'].includes(data.hd)) {
        semantic = 'p2pkh';
      } else if ('BIP49' === data.hd) {
        semantic = 'p2wpkh-in-p2sh';
      } if (['BIP84', 'BIP141'].includes(data.hd)) {
        semantic = 'p2wpkh';
      }
    }

    try {
      hdwallet = new HDWallet(cryptocurrency, {
        hd: HDS.getHDClass(data.hd),
        network: data.network,
        language: data.language,
        publicKeyType: data.publicKeyType,
        passphrase: data.passphrase,
        cardanoType: data.cardanoType,
        addressType: data.addressType,
        stakingPublicKey: data.stakingPublicKey,
        mode: data.mode,
        mnemonicType: data.mnemonicType,
        checksum: data.checksum,
        paymentID: data?.paymentID,
        semantic: semantic,
      });

      if (this.getFromNormalize(data.from) === 'entropy') {
        const entropyClass = ENTROPIES.getEntropyClass(data.client);
        hdwallet.fromEntropy(new entropyClass(data.entropy));
      } else if (this.getFromNormalize(data.from) === 'mnemonic') {
        const mnemonicClass = MNEMONICS.getMnemonicClass(data.client);
        hdwallet.fromMnemonic(new mnemonicClass(data.mnemonic, { mnemonicType: data.mnemonicType }));
      } else if (this.getFromNormalize(data.from) === 'seed') {
        const seedClass = SEEDS.getSeedClass(data.client);
        hdwallet.fromSeed(new seedClass(data.seed));
      } else if (this.getFromNormalize(data.from) === 'xprivate-key') {
        hdwallet.fromXPrivateKey(data.xprivateKey, true, data.strict);
      } else if (this.getFromNormalize(data.from) === 'xpublic-key') {
        hdwallet.fromXPublicKey(data.xpublicKey, true, data.strict);
      } else if (this.getFromNormalize(data.from) === 'private-key') {
        hdwallet.fromPrivateKey(data.privateKey);
      } else if (this.getFromNormalize(data.from) === 'wif') {
        let wif = data.wif;
        // if (data.bip38) {
        //   const bip38 = new BIP38(BIP38_CRYPTOCURRENCIES[cryptocurrency.NAME], data.network);
        //   wif = bip38.decrypt(data.wif, data.passphrase);
        // }
        hdwallet.fromWIF(wif);

      } else if (this.getFromNormalize(data.from) === 'public-key') {
        hdwallet.fromPublicKey(data.publicKey);
      } else if (this.getFromNormalize(data.from) === 'spend-private-key') {
        hdwallet.fromSpendPrivateKey(data.spendPrivateKey);
      } else if (this.getFromNormalize(data.from) === 'watch-only') {
        hdwallet.fromWatchOnly(data.viewPrivateKey, data.spendPublicKey);
      }
      hdwallet.getDump();
    } catch (e) {
      this.terminalService.update((e as Error).message, 'error');
      this.groupBoxService.update(data.from, 'error');
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
      return;
    }

    try {
      const shouldDerive = [
        'entropy', 'mnemonic', 'seed', 'xprivate-key', 'xpublic-key', 'spend-private-key', 'watch-only'
      ].includes(this.getFromNormalize(data.from)) || ([
        'wif', 'private-key', 'public-key'
      ].includes(this.getFromNormalize(data.from)) && [
        'Electrum-V1', 'Monero'
      ].includes(data.hd));
      if (shouldDerive) {
        const derivationClass = DERIVATIONS.getDerivationClass(data.derivation);
        hdwallet.fromDerivation(new derivationClass({
          coinType: cryptocurrency.COIN_TYPE,
          account: data.account,
          change: data.change,
          role: data.role,
          address: data.address,
          path: data.path,
          minor: data.minor,
          major: data.major,
          ecc: cryptocurrency.ECC.NAME
        }));
      }
      let combinations = 1;
      if (hdwallet['derivation']) {
        for (const d of hdwallet['derivation'].getDerivations()) {
          if (d.length === 3) {
            combinations *= (d[1] - d[0]) + 1;
          }
        }
      }
    } catch (e) {
      this.terminalService.update((e as Error).message, 'error');
      this.groupBoxService.update('derivation', 'error');
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
      return;
    }

    try {
      const dumps: DictionaryInterface[] = [];
      if (data.format === 'json' && !data.exclude.split(',').includes('root')) {
        const newDump = hdwallet.getDump(['derivation', ...data.exclude.split(',')]);
        this.terminalService.update(newDump, data.format);
        dumps.push(newDump);
      }

      async function driveHelper(
        derivations: Array<[number, number, boolean] | [number, boolean]>,
        current: Array<[number, boolean]> = [],
        terminalService: any
      ): Promise<void> {

        if (terminalService.stopDerivation()) return;

        if (derivations.length === 0) {
          let derivation: Derivation;

          const derivationClass = DERIVATIONS.getDerivationClass(data.derivation);
          if (['BIP44', 'BIP49', 'BIP84', 'BIP86'].includes(data.derivation)) {
            derivation = new derivationClass({
              coinType: cryptocurrency.COIN_TYPE,
              account: current[2][0],
              change: current[3][0],
              address: current[4][0]
            });
          } else if (data.derivation === 'CIP1852') {
            derivation = new derivationClass({
              coinType: cryptocurrency.COIN_TYPE,
              account: current[2][0],
              change: current[3][0],
              address: current[4][0]
            });
          } else if (data.derivation === 'Electrum') {
            derivation = new derivationClass({
              change: current[0][0],
              address: current[1][0]
            });
          } else if (data.derivation === 'Monero') {
            derivation = new derivationClass({
              minor: current[0][0],
              major: current[1][0]
            });
          } else if (data.derivation === 'HDW') {
            derivation = new derivationClass({
              account: current[0][0],
              ecc: current[1][0],
              address: current[2][0]
            });
          } else {
            derivation = new derivationClass({
              path: 'm/' + current.map(([v, hardened]) => hardened ? `${v}'` : v.toString()).join('/')
            });
          }
          hdwallet.updateDerivation(derivation);

          let newDump: DictionaryInterface = { };

          if (data.format === 'csv') {
            const dump = hdwallet.getDump(['root']);
            for (const field of data.include.split(',')) {
              const parts = field.split(':');
              if (parts.length === 2) {
                newDump[`${parts[0]}:${parts[1]}`] = dump[parts[0]][parts[1]];
              } else {
                newDump[`${parts[0]}`] = dump[parts[0]];
              }
            }
          } else if (data.format === 'json') {
             newDump = hdwallet.getDump(['root', ...(data.exclude ?? '').split(',')]);
          }

          dumps.push(newDump);
          await new Promise(resolve => setTimeout(() => {
            terminalService.update(newDump, data.format);
            resolve(null);
          }, 0));
          return;
        }

        if (derivations[0].length === 3) {
          const [start, end, hardened] = derivations[0] as [number, number, boolean];
          for (let value = start; value <= end; value++) {
            await driveHelper(
              derivations.slice(1), current.concat([[value, hardened]]), terminalService
            );
          }
        } else {
          const [value, hardened] = derivations[0] as [number, boolean];
          await driveHelper(
            derivations.slice(1), current.concat([[value, hardened]]), terminalService
          );
        }
        return;
      }

      (async () => {
        if (hdwallet.derivation) {
          this.terminalService.stopDerivation.set(false);
          await driveHelper(
            hdwallet.derivation.getDerivations(), [], this.terminalService
          );
          if (dumpsType === 'save') {
            if (data.format == 'json') {
              saveAsJSON(dumps, `hdwallet-${getDateTimeStamp()}`);
            } else if (data.format == 'csv') {
              saveAsCSV(dumps, `hdwallet-${getDateTimeStamp()}`);
            }
          }
          this.groupBoxService.update(null, null);
          this.isLoading = false;
          this.terminalService.stopDerivation.set(true);
          this.changeDetectorRef.detectChanges();
        } else {
          this.terminalService.update(hdwallet.getDump(data.exclude.split(',')), 'json');
          this.groupBoxService.update(null, null);
          this.isLoading = false;
          this.terminalService.stopDerivation.set(true);
          this.changeDetectorRef.detectChanges();
        }
      })();
    } catch (e) {
      this.terminalService.update((e as Error).message, 'error');
      this.groupBoxService.update('action', 'error');
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
      return;
    }
  }
}
