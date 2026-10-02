import { ToastController } from '@ionic/angular';

export async function showToast(ctrl: ToastController, message: string): Promise<void> {
  const toast = await ctrl.create({ message, duration: 1800, position: 'top', cssClass: 'hf-toast' });
  await toast.present();
}
