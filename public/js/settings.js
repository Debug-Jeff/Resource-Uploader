// Theme management
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme from localStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', currentTheme);
    document.getElementById('themeSwitch').checked = currentTheme === 'dark';

    // Theme switch handler
    document.getElementById('themeSwitch').addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Profile form submission
    document.getElementById('profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            // Simulate API call
            await updateProfile(formData);
            showAlert('Profile updated successfully!', 'success');
        } catch (error) {
            showAlert('Failed to update profile. Please try again.', 'danger');
        }
    });

    // Profile image upload
    const profileImageOverlay = document.querySelector('.profile-image-overlay');
    if (profileImageOverlay) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        profileImageOverlay.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', async (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                try {
                    await handleProfileImageUpload(file);
                    showAlert('Profile image updated successfully!', 'success');
                } catch (error) {
                    showAlert('Failed to update profile image.', 'danger');
                }
            }
        });
    }

    // Password form submission
    document.getElementById('password-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (newPassword !== confirmPassword) {
            showAlert('New passwords do not match!', 'danger');
            return;
        }

        try {
            await updatePassword(currentPassword, newPassword);
            showAlert('Password updated successfully!', 'success');
            e.target.reset();
        } catch (error) {
            showAlert('Failed to update password. Please try again.', 'danger');
        }
    });

    // Handle notification preferences
    const notificationCheckboxes = document.querySelectorAll('#notifications .form-check-input');
    notificationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', async (e) => {
            try {
                await updateNotificationPreference(e.target.labels[0].textContent, e.target.checked);
                showAlert('Notification preferences updated!', 'success');
            } catch (error) {
                e.target.checked = !e.target.checked;
                showAlert('Failed to update notification preferences.', 'danger');
            }
        });
    });

    // Auto-delete settings
    document.querySelector('#storage .form-check-input')?.addEventListener('change', async (e) => {
        try {
            await updateAutoDeleteSettings(e.target.checked);
            showAlert('Auto-delete settings updated!', 'success');
        } catch (error) {
            e.target.checked = !e.target.checked;
            showAlert('Failed to update auto-delete settings.', 'danger');
        }
    });
});

// Utility function to show alerts
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '1050';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}

// API simulation functions
async function updateProfile(formData) {
    // Simulate API call
    return new Promise(resolve => setTimeout(resolve, 1000));
}

async function handleProfileImageUpload(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            document.querySelector('.profile-image-container img').src = reader.result;
            document.querySelector('.profile-circle').style.backgroundImage = `url(${reader.result})`;
            resolve();
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function updatePassword(currentPassword, newPassword) {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

async function toggle2FA(enabled) {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

async function updateNotificationPreference(type, enabled) {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

async function updateAutoDeleteSettings(enabled) {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

// Logout handler
function handleLogout() {
    // Clear any stored data
    localStorage.removeItem('theme');
    // Additional cleanup if needed
    window.location.href = 'landing.html';
}

function handleDeleteAccount() {
    // Show confirmation modal
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.show();
}

function confirmDelete() {
    // Simulate account deletion process
    setTimeout(() => {
        // Hide confirmation modal
        const confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
        confirmationModal.hide();

        // Show success notification
        const notification = document.getElementById('notification');
        notification.classList.remove('d-none');
    }, 2000); // Simulate a delay
}
