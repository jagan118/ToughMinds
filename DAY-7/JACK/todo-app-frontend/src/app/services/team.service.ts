// src/app/services/team.service.ts

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.services';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  
  private apiUrl = 'http://localhost:3000/api/teams';
  teams = signal<any[]>([]);
  private currentUserCacheKey: string | null = null;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }
  
  // ========== CREATE TEAM ==========
  createTeam(name: string, description: string): Observable<any> {
    return this.http.post(
      this.apiUrl,
      { name, description }
    );
  }
  
  // ========== GET ALL USER'S TEAMS ==========
  getMyTeams(): Observable<any> {
    const userKey = this.getCurrentUserCacheKey();

    if (this.currentUserCacheKey === userKey && this.teams().length > 0) {
      return of({ teams: this.teams() });
    }

    this.currentUserCacheKey = userKey;
    this.teams.set([]);

    return this.http.get<any>(`${this.apiUrl}/my-teams`).pipe(
      tap(response => {
        const teams = (response?.teams || []).map((team: any) => this.normalizeTeam(team));
        this.teams.set(teams);
      })
    );
  }
  
  getCachedTeams(): any[] {
    return this.teams();
  }

  saveMyTeams(teams: any[]) {
    this.currentUserCacheKey = this.getCurrentUserCacheKey();
    this.teams.set(teams.map((team: any) => this.normalizeTeam(team)));
  }
  
  addTeamToCache(team: any) {
    this.currentUserCacheKey = this.getCurrentUserCacheKey();

    const normalizedTeam = this.normalizeTeam(team);
    this.teams.update(list => [normalizedTeam, ...list.filter(existing => existing._id !== normalizedTeam._id)]);
  }

  removeTeamFromCache(teamId: string) {
    this.teams.update(list => list.filter(team => team._id !== teamId));
  }
  
  clearMyTeamsCache() {
    this.currentUserCacheKey = null;
    this.teams.set([]);
  }
  
  // ========== GET TEAM DETAILS + MEMBERS ==========
  getTeamDetails(teamId: string): Observable<any> {
    // Interceptor will automatically add token
    return this.http.get(
      `${this.apiUrl}/${teamId}`
    );
  }
  
  // ========== INVITE MEMBER BY EMAIL ==========
  inviteMember(teamId: string, email: string): Observable<any> {
    // Interceptor will automatically add token
    return this.http.post(
      `${this.apiUrl}/${teamId}/invite`,
      { email }
    );
  }
  
  // ========== REMOVE MEMBER FROM TEAM ==========
  removeMember(teamId: string, userId: string): Observable<any> {
    // Interceptor will automatically add token
    return this.http.delete(
      `${this.apiUrl}/${teamId}/members/${userId}`
    );
  }
  
  // ========== DELETE TEAM ==========
  deleteTeam(teamId: string): Observable<any> {
    // Interceptor will automatically add token
    return this.http.delete(
      `${this.apiUrl}/${teamId}`
    );
  }
  
  // ========== GET TEAM TODOS ==========
  getTeamTodos(teamId: string): Observable<any> {
    // Interceptor will automatically add token
    return this.http.get(
      `http://localhost:3000/api/todos/team/${teamId}`
    );
  }

  private getCurrentUserCacheKey(): string {
    const user = this.authService.currentUser() as any;
    return (user?._id || user?.id || user?.email || 'anonymous') as string;
  }

  private normalizeTeam(team: any): any {
    const currentUser = this.authService.currentUser() as any;
    const currentUserId = currentUser?._id || currentUser?.id || currentUser?.email;
    const ownerId = team?.owner || team?.ownerId || team?.owner?._id || team?.owner?._id;
    const isOwner = Boolean(currentUserId && ownerId && String(ownerId) === String(currentUserId));

    return {
      ...team,
      role: team?.role === 'owner' || isOwner ? 'owner' : (team?.role || 'member'),
      isOwner,
      ownerId: ownerId || team?.ownerId || null
    };
  }
}