
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
});


// File validation and management
const SUPPORTED_TYPES = {
    'application/pdf': '.PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.DOCX',
    'application/vnd.ms-powerpoint': '.PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.PPTX',
    'application/vnd.ms-excel': '.XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.XLSX',
    'application/zip': '.ZIP',
    'image/jpeg': '.JPG',
    'image/png': '.PNG',
    'video/mp4': '.MP4',
    'audio/mpeg': '.MP3'
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
let uploadedFiles = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeDragAndDrop();
    initializeSearchFunctionality();
    initializeViewToggle();
    initializeFileActions();
});

// Drag and Drop Functionality
function initializeDragAndDrop() {
    const dropArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('fileInput');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight);
    });

    dropArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileInput);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    const dropArea = document.querySelector('.upload-area');
    dropArea.classList.add('bg-light', 'border-primary');
}

function unhighlight(e) {
    const dropArea = document.querySelector('.upload-area');
    dropArea.classList.remove('bg-light', 'border-primary');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileInput(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => validateFile(file));

    if (validFiles.length < fileArray.length) {
        showNotification('Some files were not supported or too large.', 'warning');
    }

    validFiles.forEach(file => {
        uploadFile(file);
    });
}

function validateFile(file) {
    if (!SUPPORTED_TYPES[file.type]) {
        showNotification(`File type ${file.type} is not supported.`, 'error');
        return false;
    }

    if (file.size > MAX_FILE_SIZE) {
        showNotification(`File ${file.name} is too large. Maximum size is 100MB.`, 'error');
        return false;
    }

    return true;
}

// File Upload and Management
async function uploadFile(file) {
    const fileId = generateFileId();
    const fileData = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        status: 'uploading'
    };

    // Add to uploaded files array
    uploadedFiles.push(fileData);

    // Add file card to gallery
    addFileCard(fileData);

    try {
        // Simulate file upload with progress
        await simulateFileUpload(fileId);

        // Update file status
        updateFileStatus(fileId, 'uploaded');
        showNotification(`${file.name} uploaded successfully!`, 'success');
    } catch (error) {
        updateFileStatus(fileId, 'error');
        showNotification(`Failed to upload ${file.name}`, 'error');
    }
}

function addFileCard(fileData) {
    const gallery = document.querySelector('.row.g-4');
    const fileIcon = getFileIcon(fileData.type);
    const fileSize = formatFileSize(fileData.size);

    const cardHtml = `
            <div class="col-md-3" id="file-${fileData.id}">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <i class="${fileIcon} fa-3x mb-3"></i>
                        <h5 class="card-title text-truncate">${fileData.name}</h5>
                        <p class="card-text text-muted small">${fileSize}</p>
                        <div class="progress mb-2 ${fileData.status === 'uploaded' ? 'd-none' : ''}">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" 
                                role="progressbar" 
                                style="width: 0%">
                            </div>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary" onclick="downloadFile('${fileData.id}')">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="editFile('${fileData.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteFile('${fileData.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    gallery.insertAdjacentHTML('afterbegin', cardHtml);
}

function downloadFile(fileId) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
        showNotification(`Downloading ${file.name}...`, 'info');
        // Implement download functionality here
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([file.content], {type: file.type}));
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function editFile(fileId) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
        showNotification(`Editing ${file.name}...`, 'info');
        // Open a modal or new view for editing
        const editModal = document.getElementById('editModal');
        const editForm = document.getElementById('editForm');
        editModal.querySelector('.modal-title').textContent = `Edit ${file.name}`;
        editForm.elements['fileName'].value = file.name;
        editForm.elements['fileType'].value = file.type;
        editForm.elements['fileSize'].value = formatFileSize(file.size);
        editModal.dataset.fileId = file.id;
        new bootstrap.Modal(editModal).show();
    }
}

// Handle edit form submission
document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const fileId = form.closest('.modal').dataset.fileId;
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
        file.name = form.elements['fileName'].value;
        file.type = form.elements['fileType'].value;
        showNotification(`File ${file.name} updated successfully!`, 'success');
        new bootstrap.Modal(document.getElementById('editModal')).hide();
    }
});

function deleteFile(fileId) {
    if (confirm('Are you sure you want to delete this file?')) {
        const fileElement = document.getElementById(`file-${fileId}`);
        const fileIndex = uploadedFiles.findIndex(f => f.id === fileId);

        if (fileElement && fileIndex !== -1) {
            fileElement.remove();
            uploadedFiles.splice(fileIndex, 1);
            showNotification('File deleted successfully', 'success');
        }
    }
}

// UI Functions
function initializeViewToggle() {
    const gridButton = document.querySelector('.btn-group .btn:first-child');
    const listButton = document.querySelector('.btn-group .btn:last-child');
    const gallery = document.querySelector('.row.g-4');

    gridButton.addEventListener('click', () => {
        gallery.classList.remove('list-view');
        gridButton.classList.add('active');
        listButton.classList.remove('active');
    });

    listButton.addEventListener('click', () => {
        gallery.classList.add('list-view');
        listButton.classList.add('active');
        gridButton.classList.remove('active');
    });
}

function initializeSearchFunctionality() {
    const searchInput = document.querySelector('input[type="search"]');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const fileCards = document.querySelectorAll('.card');

        fileCards.forEach(card => {
            const fileName = card.querySelector('.card-title').textContent.toLowerCase();
            if (fileName.includes(searchTerm)) {
                card.closest('.col-md-3').style.display = '';
            } else {
                card.closest('.col-md-3').style.display = 'none';
            }
        });
    });
}

// Utility Functions
function getFileIcon(fileType) {
    const iconMap = {
        'application/pdf': 'far fa-file-pdf text-danger',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'far fa-file-word text-primary',
        'application/vnd.ms-powerpoint': 'far fa-file-powerpoint text-danger',
        'application/vnd.ms-excel': 'far fa-file-excel text-success',
        'application/zip': 'far fa-file-archive text-warning',
        'image': 'far fa-file-image text-info',
        'video': 'far fa-file-video text-primary',
        'audio': 'far fa-file-audio text-success'
    };

    return iconMap[fileType] || 'far fa-file text-secondary';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateFileId() {
    return 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function updateFileStatus(fileId, status) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
        file.status = status;
        const cardElement = document.getElementById(`file-${fileId}`);
        const progressBar = cardElement.querySelector('.progress');

        if (status === 'uploaded') {
            progressBar.classList.add('d-none');
        }
    }
}

// Simulated file upload with progress
function simulateFileUpload(fileId) {
    return new Promise((resolve, reject) => {
        let progress = 0;
        const cardElement = document.getElementById(`file-${fileId}`);
        const progressBar = cardElement.querySelector('.progress-bar');

        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                resolve();
            }
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${Math.round(progress)}%`;
        }, 500);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification container 
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(notificationContainer);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.role = 'alert';
    notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

    // Add notification to container
    notificationContainer.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

