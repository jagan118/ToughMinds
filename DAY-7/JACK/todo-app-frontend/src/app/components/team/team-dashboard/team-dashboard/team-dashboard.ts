// src/app/components/team/team-dashboard/team-dashboard.ts

import { Component, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { TeamService } from '../../../../services/team.service';
import { AuthService } from '../../../../services/auth.services';

@Component({
  selector: 'app-team-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-dashboard.html',
  styleUrls: ['./team-dashboard.css']
})
export class TeamDashboardComponent implements OnInit {
  
  readonly teams: Signal<any[]>;
  loading = signal(false);
  error = '';
  showCreateForm = false;
  newTeamName = '';
  newTeamDescription = '';
  
  constructor(
    private teamService: TeamService,
    private authService: AuthService,
    private router: Router
  ) {
    this.teams = this.teamService.teams;
  }
  
  ngOnInit() {
    this.loadTeams();
  }
  
  // ========== LOAD ALL TEAMS ==========
  loadTeams() {
    if (this.teams().length > 0) {
      return;
    }

    this.loading.set(true);
    this.error = '';
    
    this.teamService.getMyTeams().subscribe({
      next: (response) => {
        console.log('✅ Teams loaded:', response.teams);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error loading teams:', err);
        this.error = err.message || 'Failed to load teams';
        this.loading.set(false);
      }
    });
  }
  
  // ========== CREATE NEW TEAM ==========
  createTeam() {
    if (!this.newTeamName.trim()) {
      this.error = 'Team name is required';
      return;
    }
    
    this.loading.set(true);
    this.error = '';
    
    this.teamService.createTeam(this.newTeamName, this.newTeamDescription).subscribe({
      next: (response) => {
        console.log('✅ Team created:', response.team);
        
        // Add new team to list and mark current user as owner
        this.teamService.addTeamToCache({
          ...response.team,
          owner: response.team?.owner || this.authService.currentUser()?._id,
          role: 'owner',
          isOwner: true
        });
        
        // Reset form
        this.newTeamName = '';
        this.newTeamDescription = '';
        this.showCreateForm = false;
        
        this.loading.set(false) ;
      },
      error: (err) => {
        console.error('❌ Error creating team:', err);
        this.error = err.message || 'Failed to create team';
        this.loading.set(false);
      }
    });
  }
  
  // ========== VIEW TEAM DETAILS ==========
  viewTeam(teamId: string) {
    console.log('🔄 Navigating to team:', teamId);
    this.router.navigate(['/teams', teamId]);
  }
  
  // ========== DELETE TEAM ==========
  deleteTeam(teamId: string, teamName: string) {
    if (!confirm(`Are you sure you want to delete "${teamName}"?`)) {
      return;
    }
    
    this.teamService.deleteTeam(teamId).subscribe({
      next: () => {
        console.log('✅ Team deleted');
        this.teamService.removeTeamFromCache(teamId);
      },
      error: (err) => {
        console.error('❌ Error deleting team:', err);
        this.error = err.message || 'Failed to delete team';
      }
    });
  }
}