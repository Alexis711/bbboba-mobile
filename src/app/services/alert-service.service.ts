import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

type AlertKind = 'success' | 'warning' | 'error';

interface ToastExtra {
  duration?: number;       // ms
  position?: 'top' | 'middle' | 'bottom';
}

interface AlertExtra {
  okText?: string;
}

@Injectable({
  providedIn: 'root'
})

export class AlertServiceService {
  private colorByKind: Record<AlertKind, string> = {
    success: 'success',
    warning: 'warning',
    error: 'danger',
  };

  private iconByKind: Record<AlertKind, string> = {
    success: 'checkmark-circle',
    warning: 'alert-circle',
    error: 'close-circle',
  };

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  async toast(
    message: string,
    kind: AlertKind = 'success',
    extra: ToastExtra = {}
  ): Promise<void> {
    const t = await this.toastCtrl.create({
      message,
      duration: extra.duration ?? 2500,
      position: extra.position ?? 'bottom',
      color: this.colorByKind[kind],
      icon: this.iconByKind[kind],
      buttons: kind === 'error' ? [{ text: 'OK', role: 'cancel' }] : undefined,
    });
    await t.present();
  }

  success(
    message: string,
    extra?: ToastExtra
  ) {
    return this.toast(message, 'success', extra);
  }

  warning(
    message: string,
    extra?: ToastExtra
  ) {
    return this.toast(message, 'warning', extra);
  }

  error(
    message: string, 
    extra?: ToastExtra
  ) { 
    return this.toast(message, 'error', extra); 
  }

  async alert(
    header: string,
    message: string,
    kind: AlertKind = 'success',
    extra: AlertExtra = {}
  ): Promise<void> {
    const a = await this.alertCtrl.create({
      header,
      message,
      cssClass: `alert-${kind}`,
      buttons: [{ text: extra.okText ?? 'OK', role: 'confirm' }],
      animated: true
    });
    await a.present();
  }

  alertSuccess(
    header: string, 
    msg: string, 
    extra?: AlertExtra
  ) { 
    return this.alert(header, msg, 'success', extra); 
  }
  alertWarning(
    header: string, 
    msg: string, 
    extra?: AlertExtra
  ) { 
    return this.alert(header, msg, 'warning', extra); 
  }
  alertError(
    header: string, 
    msg: string, 
    extra?: AlertExtra
  ) { 
    return this.alert(header, msg, 'error', extra); 
  }
}
