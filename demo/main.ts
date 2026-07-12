import { sign, unsign } from '../runtimes/browser.ts';

// Dom Elements
const signValueInput = document.getElementById(
  'sign-value',
) as HTMLInputElement;
const signSecretInput = document.getElementById(
  'sign-secret',
) as HTMLInputElement;
const signOutput = document.getElementById('sign-output') as HTMLElement;
const copySignedBtn = document.getElementById(
  'copy-signed',
) as HTMLButtonElement;

const unsignValueInput = document.getElementById(
  'unsign-value',
) as HTMLInputElement;
const unsignSecretInput = document.getElementById(
  'unsign-secret',
) as HTMLInputElement;
const unsignOutput = document.getElementById('unsign-output') as HTMLElement;
const statusContainer = document.getElementById(
  'status-container',
) as HTMLElement;
const verificationStatus = document.getElementById(
  'verification-status',
) as HTMLElement;
const statusText = verificationStatus.querySelector(
  '.status-text',
) as HTMLElement;

const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const toast = document.getElementById('toast') as HTMLElement;

// Toggle password visibility
togglePasswordBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling as HTMLInputElement;
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🔒';
    } else {
      input.type = 'password';
      btn.textContent = '👁️';
    }
  });
});

// Toast notification
function showToast(message: string) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// Copy to Clipboard
copySignedBtn.addEventListener('click', () => {
  const text = signOutput.textContent || '';
  if (text && text !== '—' && !text.includes('Error')) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast('Copied to clipboard!');
      })
      .catch(() => {
        showToast('Failed to copy.');
      });
  }
});

// Real-time Signing
async function handleSign() {
  const value = signValueInput.value;
  const secret = signSecretInput.value;

  if (!value) {
    signOutput.textContent = '—';
    return;
  }
  if (!secret) {
    signOutput.textContent = 'Please enter a secret key';
    return;
  }

  try {
    const result = await sign(value, secret);
    signOutput.textContent = result;
  } catch (err: any) {
    signOutput.textContent = `Error: ${err.message}`;
  }
}

// Real-time Unsigning
async function handleUnsign() {
  const signedInput = unsignValueInput.value.trim();
  const secret = unsignSecretInput.value;

  if (!signedInput) {
    statusContainer.classList.add('hidden');
    unsignOutput.textContent = '—';
    return;
  }

  statusContainer.classList.remove('hidden');

  if (!secret) {
    verificationStatus.className = 'status-indicator error';
    statusText.textContent = 'Secret key must be provided';
    unsignOutput.textContent = '—';
    return;
  }

  try {
    const result = await unsign(signedInput, secret);

    if (result !== false) {
      verificationStatus.className = 'status-indicator success';
      statusText.textContent = 'Signature Verified Successfully!';
      unsignOutput.textContent = result;

      // Automatically sync to sign value for easy testing
      signValueInput.value = result;
      handleSign();
    } else {
      verificationStatus.className = 'status-indicator error';
      statusText.textContent =
        'Invalid Signature! The string has been tampered with.';
      unsignOutput.textContent = '—';
    }
  } catch (err: any) {
    verificationStatus.className = 'status-indicator error';
    statusText.textContent = `Error: ${err.message}`;
    unsignOutput.textContent = '—';
  }
}

// Event Listeners for inputs
signValueInput.addEventListener('input', handleSign);
signSecretInput.addEventListener('input', handleSign);

unsignValueInput.addEventListener('input', handleUnsign);
unsignSecretInput.addEventListener('input', handleUnsign);

// Initial Execution
handleSign();
