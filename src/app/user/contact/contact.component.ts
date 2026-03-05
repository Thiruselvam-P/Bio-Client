import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: false,
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      queryType: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (!this.contactForm.valid) return;

    this.contactService.sendMessage(this.contactForm.value).subscribe({
      next: () => {
        alert('Message sent successfully!');
        this.contactForm.reset();
      },
      error: (err) => {
        console.error('Contact form submit error', err);
        alert('Failed to send message. Please try again later.');
      },
    });
  }
}
