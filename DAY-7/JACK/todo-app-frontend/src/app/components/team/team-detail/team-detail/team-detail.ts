// src/app/components/team/team-detail/team-detail.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { TeamService } from '../../../../services/team.service';
import { TodoService } from '../../../../services/todo.service';
import { AuthService } from '../../../../services/auth.services';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './team-detail.html',
  styleUrls: ['./team-detail.css']
})
export class TeamDetailComponent implements OnInit {
  
  teamId: string = '';
  team = signal<any | null>(null);
  members = signal<any[]>([]);
  yourRole = signal('');
  loading = signal(false);
  error = signal<string>('');
  successMessage = signal<string>('');
  teamTodos = signal<any[]>([]);

  // Invite form
  showInviteForm = false;
  inviteEmail = '';
  
  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.teamId = paramMap.get('teamId') || '';

      if (!this.authService.isLoggedInCheck()) {
        this.error.set('Please login first');
        this.router.navigate(['/login']);
        return;
      }

      if (!this.teamId) {
        this.error.set('Invalid team ID');
        this.router.navigate(['/teams']);
        return;
      }

      this.team.set(null);
      this.members.set([]);
      this.teamTodos.set([]);
      this.yourRole.set('');
      this.loadTeamDetails();
    });
  }
  
  // ========== LOAD TEAM DETAILS ==========
  loadTeamDetails() {
    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');
    
    this.teamService.getTeamDetails(this.teamId).subscribe({
      next: (response) => {
        console.log('✅ Team details loaded:', response);
        
        this.team.set(response.team);
        this.members.set(response.members || []);
        this.yourRole.set(response.yourRole);
        this.loadTeamTodos();
        
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error loading team details:', err);
        this.team.set(null);
        this.members.set([]);
        this.teamTodos.set([]);
        this.error.set(this.getErrorMessage(err, 'Failed to load team details'));
        this.loading.set(false);
      }
    });
  }
  
  // ========== INVITE MEMBER ==========
  inviteMember() {
    if (!this.inviteEmail.trim()) {
      this.error.set('Email is required');
      return;
    }
    
    // Basic email validation
    if (!this.isValidEmail(this.inviteEmail)) {
      this.error.set('Invalid email format');
      return;
    }
    
    this.error.set('');
    this.successMessage.set('');
    
    this.teamService.inviteMember(this.teamId, this.inviteEmail).subscribe({
      next: (response) => {
        console.log('✅ Member invited:', response);
        
        // Add new member to list
        this.members.update(list => [
          ...list,
          {
            name: response.member.name,
            email: response.member.email,
            role: response.member.role,
            joinedAt: new Date(),
            userId: response.member.userId || 'new'
          }
        ]);
        
        // Reset form
        this.inviteEmail = '';
        this.showInviteForm = false;
        this.successMessage.set(response.message || 'Member invited successfully');
        
        // Clear message after 3 seconds
        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      },
      error: (err) => {
        console.error('❌ Error inviting member:', err);
        this.error.set(this.getErrorMessage(err, 'Failed to invite member'));
      }
    });
  }

  loadTeamTodos() {
    this.teamService.getTeamTodos(this.teamId).subscribe({
      next: (response) => {
        this.teamTodos.set(response.todos || []);
      },
      error: (err) => {
        console.error('❌ Error loading team todos:', err);
        this.error.set(this.getErrorMessage(err, 'Failed to load team todos'));
      }
    });
  }

  // ========== REMOVE MEMBER ==========
  removeMember(userId: string, memberName: string) {
    if (!confirm(`Remove ${memberName} from team?`)) {
      return;
    }
    
    this.teamService.removeMember(this.teamId, userId).subscribe({
      next: () => {
        console.log('✅ Member removed');
        this.members.update(list => list.filter(m => m.userId !== userId));
        this.successMessage.set(`${memberName} has been removed from the team`);

        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      },
      error: (err) => {
        console.error('❌ Error removing member:', err);
        this.error.set(this.getErrorMessage(err, 'Failed to remove member'));
      }
    });
  }
  
  toggleTodoCompletion(todo: any) {
    this.error.set('');
    this.successMessage.set('');

    this.todoService.toggleComplete(todo._id).then((updatedTodo) => {
      this.teamTodos.update(list =>
        list.map(item => item._id === todo._id ? { ...item, completed: updatedTodo.completed } : item)
      );

      this.successMessage.set(updatedTodo.completed ? 'Todo marked as done' : 'Todo marked as pending');
      setTimeout(() => {
        this.successMessage.set('');
      }, 3000);
    }).catch((err) => {
      this.error.set(this.getErrorMessage(err, 'Failed to update todo'));
    });
  }

  // ========== HELPER: CHECK IF OWNER ==========
  isOwner(): boolean {
    return this.yourRole() === 'owner';
  }

  private getErrorMessage(err: any, fallback: string): string {
    const serverMessage = err?.error?.message || err?.error?.error || err?.message;

    if (typeof serverMessage === 'string' && serverMessage.trim()) {
      return serverMessage;
    }

    if (err?.status === 404) {
      return 'The requested resource was not found.';
    }

    if (err?.status === 403) {
      return 'You are not allowed to perform this action.';
    }

    if (err?.status === 400) {
      return 'The request could not be processed.';
    }

    return fallback;
  }
  
  // ========== HELPER: VALIDATE EMAIL ==========
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}