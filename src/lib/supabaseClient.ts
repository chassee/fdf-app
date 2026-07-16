/**
 * PHASE 0: Supabase client integration
 * 
 * This module provides functions to read/write from the canonical user_state table
 * and other Phase 0 tables.
 */

import { supabase } from './supabase';
import { ProgressionState, getProgressionState } from './progression';

export interface UserState {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  last_checkin_date: string | null;
  dna_score: number;
  tier: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get the user's progression state from the database
 * This is the canonical source of truth
 */
export async function getUserProgressionState(userId: string): Promise<ProgressionState | null> {
  try {
    const { data, error } = await supabase
      .from('user_state')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user_state:', error);
      return null;
    }
    
    if (!data) return null;
    
    return getProgressionState(
      data.total_xp,
      data.current_streak,
      data.longest_streak
    );
  } catch (err) {
    console.error('Error in getUserProgressionState:', err);
    return null;
  }
}

/**
 * Get raw user_state from database (for components that need all fields)
 */
export async function getUserState(userId: string): Promise<UserState | null> {
  try {
    const { data, error } = await supabase
      .from('user_state')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user_state:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in getUserState:', err);
    return null;
  }
}

/**
 * Update user's XP (called after mission completion)
 */
export async function updateUserXp(userId: string, xpDelta: number): Promise<boolean> {
  try {
    const { data: currentState } = await supabase
      .from('user_state')
      .select('total_xp')
      .eq('user_id', userId)
      .single();
    
    const newXp = (currentState?.total_xp || 0) + xpDelta;
    
    const { error } = await supabase
      .from('user_state')
      .update({
        total_xp: newXp,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating XP:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateUserXp:', err);
    return false;
  }
}

/**
 * Update user's streak (called after daily checkin)
 */
export async function updateUserStreak(
  userId: string,
  newStreak: number,
  longestStreak: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_state')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(longestStreak, newStreak),
        last_checkin_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating streak:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateUserStreak:', err);
    return false;
  }
}

/**
 * Initialize user_state for a new user
 */
export async function initializeUserState(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_state')
      .insert({
        user_id: userId,
        total_xp: 0,
        current_level: 1,
        current_streak: 0,
        longest_streak: 0,
        dna_score: 0,
        tier: 'Foundation',
      });
    
    if (error) {
      console.error('Error initializing user_state:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in initializeUserState:', err);
    return false;
  }
}

/**
 * Save a mission response (append-only)
 */
export async function saveMissionResponse(
  userId: string,
  missionId: string,
  responseData: any
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('mission_responses')
      .insert({
        user_id: userId,
        mission_id: missionId,
        response_data: responseData,
      });
    
    if (error) {
      console.error('Error saving mission response:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in saveMissionResponse:', err);
    return false;
  }
}

/**
 * Get user's mission responses (for progress journal)
 */
export async function getUserMissionResponses(userId: string) {
  try {
    const { data, error } = await supabase
      .from('mission_responses')
      .select(`
        id,
        mission_id,
        response_data,
        created_at,
        mission_definitions(title, xp_reward)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching mission responses:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getUserMissionResponses:', err);
    return [];
  }
}

/**
 * Record a DNA event (append-only)
 */
export async function recordDnaEvent(
  userId: string,
  trait: string,
  delta: number,
  reason: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('dna_events')
      .insert({
        user_id: userId,
        trait,
        delta,
        reason,
      });
    
    if (error) {
      console.error('Error recording DNA event:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in recordDnaEvent:', err);
    return false;
  }
}

/**
 * Get user's DNA events (for DNA page and progress journal)
 */
export async function getUserDnaEvents(userId: string) {
  try {
    const { data, error } = await supabase
      .from('dna_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching DNA events:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getUserDnaEvents:', err);
    return [];
  }
}

/**
 * Record a daily check-in and update streak
 */
export async function recordDailyCheckin(
  userId: string,
  newStreak: number
): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Record check-in event
    const { error: checkinError } = await supabase
      .from('daily_checkins')
      .insert({
        user_id: userId,
        checkin_date: today,
      });
    
    if (checkinError) {
      console.error('Error recording check-in:', checkinError);
      return false;
    }
    
    // Update user_state with new streak
    const { error: updateError } = await supabase
      .from('user_state')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, 0), // Will be calculated properly on read
        last_checkin_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Error updating streak:', updateError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in recordDailyCheckin:', err);
    return false;
  }
}

/**
 * Check if user has already checked in today
 */
export async function hasCheckedInToday(userId: string): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_checkins')
      .select('id')
      .eq('user_id', userId)
      .eq('checkin_date', today)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking daily checkin:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Error in hasCheckedInToday:', err);
    return false;
  }
}

/**
 * Get user's daily check-in history
 */
export async function getUserDailyCheckins(userId: string, limit: number = 30) {
  try {
    const { data, error } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .order('checkin_date', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching daily checkins:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getUserDailyCheckins:', err);
    return [];
  }
}
