import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { User, Order } from '../../models/models';

@Component({
  standalone: false,
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  selectedUserOrders: Order[] = [];
  selectedUser: User | null = null;
  loading = true;
  showOrdersModal = false;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.authService.getUsers().subscribe({
      next: (data) => {
        // Filter out admin themselves or just show all
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading = false;
      }
    });
  }

  toggleBlock(user: User) {
    const newStatus = !user.isActive;
    const action = newStatus ? 'unblock' : 'block';
    const userId = user._id || user.id;
    
    if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      this.authService.toggleUserBlock(userId, newStatus).subscribe({
        next: () => {
          user.isActive = newStatus;
          // Optionally show a success message
        },
        error: (err) => {
          console.error(`Error ${action}ing user:`, err);
          alert(`Failed to ${action} user. Please try again.`);
        }
      });
    }
  }

  viewOrders(user: User) {
    this.selectedUser = user;
    this.loading = true;
    const userId = user._id || user.id;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        // Filter orders for this user on frontend since we might not have a dedicated endpoint
        // Note: some backends might return user as an object or just ID
        this.selectedUserOrders = orders.filter(o => 
          (typeof o.userId === 'string' ? o.userId === userId : o.userId?._id === userId)
        );
        this.showOrdersModal = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.loading = false;
      }
    });
  }

  closeModal() {
    this.showOrdersModal = false;
    this.selectedUser = null;
    this.selectedUserOrders = [];
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.authService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => (u._id || u.id) !== userId);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        }
      });
    }
  }
}
