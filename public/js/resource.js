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

// Storage and file management functionality
class StorageManager {
    constructor() {
        this.storageData = {
            totalSpace: 10 * 1024 * 1024 * 1024, // 10GB in bytes
            usedSpace: 6.5 * 1024 * 1024 * 1024, // 6.5GB in bytes
            fileCategories: {
                documents: { size: 2.3 * 1024 * 1024 * 1024, count: 125 },
                images: { size: 1.8 * 1024 * 1024 * 1024, count: 348 },
                videos: { size: 1.5 * 1024 * 1024 * 1024, count: 52 },
                others: { size: 0.9 * 1024 * 1024 * 1024, count: 73 }
            }
        };
        
        this.initializeEventListeners();
        this.updateStorageDisplay();
    }

    initializeEventListeners() {
        // Quick Actions
        document.querySelectorAll('.list-group-item').forEach(action => {
            action.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleQuickAction(e.currentTarget.textContent.trim());
            });
        });

        // Sort dropdown
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSort(e.currentTarget.textContent.trim());
            });
        });

        // Category cards
        document.querySelectorAll('.card .btn-outline-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.currentTarget.closest('.card').querySelector('.card-title').textContent;
                this.viewCategory(category);
            });
        });

        // Search functionality
        const searchForm = document.querySelector('form[role="search"]');
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch(searchForm.querySelector('input[type="search"]').value);
        });
    }

    updateStorageDisplay() {
        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        const usagePercentage = (this.storageData.usedSpace / this.storageData.totalSpace) * 100;
        progressBar.style.width = `${usagePercentage}%`;
        progressBar.textContent = `${Math.round(usagePercentage)}% Used`;

        // Update storage text
        const usedGb = (this.storageData.usedSpace / (1024 * 1024 * 1024)).toFixed(1);
        const totalGb = (this.storageData.totalSpace / (1024 * 1024 * 1024)).toFixed(1);
        document.querySelector('.text-muted').textContent = `${usedGb} GB of ${totalGb} GB used`;

        // Update category sizes
        Object.entries(this.storageData.fileCategories).forEach(([category, data]) => {
            const categoryElement = document.querySelector(`.text-center:has(i) small[class="text-muted"]:contains("${(data.size / (1024 * 1024 * 1024)).toFixed(1)} GB")`);
            if (categoryElement) {
                categoryElement.textContent = `${(data.size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
            }
        });
    }

    handleQuickAction(action) {
        switch(action) {
            case 'Empty Trash':
                this.emptyTrash();
                break;
            case 'Archive Files':
                this.archiveFiles();
                break;
            case 'Download All':
                this.downloadAll();
                break;
            case 'Share Files':
                this.shareFiles();
                break;
        }
    }

    emptyTrash() {
        if (confirm('Are you sure you want to permanently delete all items in the trash?')) {
            // Simulate trash emptying
            setTimeout(() => {
                this.showNotification('Trash has been emptied successfully', 'success');
            }, 1000);
        }
    }

    archiveFiles() {
        // Show archive dialog
        const archiveName = prompt('Enter a name for your archive:', 'MyArchive');
        if (archiveName) {
            this.showNotification('Creating archive...', 'info');
            setTimeout(() => {
                this.showNotification('Files archived successfully', 'success');
            }, 2000);
        }
    }

    downloadAll() {
        if (confirm('Download all files? This might take a while.')) {
            this.showNotification('Preparing files for download...', 'info');
            setTimeout(() => {
                this.showNotification('Download started', 'success');
            }, 1500);
        }
    }

    shareFiles() {
        // Implement sharing dialog
        const shareUrl = 'https://example.com/share/' + Math.random().toString(36).substring(7);
        prompt('Copy the sharing link:', shareUrl);
    }

    handleSort(criterion) {
        const dropdown = document.querySelector('.dropdown-toggle');
        dropdown.textContent = `Sort by: ${criterion}`;
        this.showNotification(`Sorting by ${criterion.toLowerCase()}...`, 'info');
        
        // Simulate sorting delay
        setTimeout(() => {
            this.showNotification('Files sorted successfully', 'success');
        }, 500);
    }

    viewCategory(category) {
        const categoryName = category.split('\n')[0].trim();
        this.showNotification(`Loading ${categoryName} files...`, 'info');
        // Implement category view logic
        setTimeout(() => {
            this.showNotification(`${categoryName} files loaded`, 'success');
        }, 1000);
    }

    handleSearch(query) {
        if (query.trim()) {
            this.showNotification(`Searching for "${query}"...`, 'info');
            // Implement search logic
            const searchResults = [];
            Object.values(this.storageData.fileCategories).forEach(category => {
                category.files.forEach(file => {
                    if (file.name.toLowerCase().includes(query.toLowerCase())) {
                        searchResults.push(file);
                    }
                });
            });
            // Display search results (simulate with a delay)
            setTimeout(() => {
                console.log('Search results:', searchResults);
                this.showNotification(`Search completed`, 'success');
            }, 800);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification container 
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(container);
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Add to container
        container.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize storage manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.storageManager = new StorageManager();
});

const script = document.createElement('script');
script.textContent = `
    // CSS for notifications
    const style = document.createElement('style');
    style.textContent = \`
        .notification-container {
            z-index: 1050;
            max-width: 300px;
        }
        .notification-container .alert {
            margin-bottom: 1rem;
        }
    \`;
    document.head.appendChild(style);
`;
document.body.appendChild(script);