import { Component } from '@angular/core';
import { FloatingWhatsappComponent } from './floating-whatsapp.component';

// Replaces the AI assistant with the existing WhatsApp contact button
// in the production build uploaded to Hostinger.
@Component({
  selector: 'app-chat-launcher',
  imports: [FloatingWhatsappComponent],
  template: '<app-floating-whatsapp />',
})
export class ChatLauncherComponent {}
