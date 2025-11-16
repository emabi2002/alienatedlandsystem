export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'land_officer' | 'applicant' | 'land_board_member' | 'viewer'

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'pending_land_board'
  | 'approved'
  | 'rejected'
  | 'on_hold'
  | 'requires_revision'

export type ApplicationType =
  | 'business_commercial'
  | 'business_industrial'
  | 'residential_high'
  | 'residential_medium'
  | 'residential_low'
  | 'agricultural'
  | 'pastoral'
  | 'mission'
  | 'special_purpose'
  | 'urban_development'
  | 'renewal'
  | 'subdivision'
  | 'consolidation'
  | 'license'
  | 'rent_reduction'

export type LeaseStatus = 'active' | 'expired' | 'terminated' | 'pending_renewal' | 'forfeited'

export type ParcelStatus = 'available' | 'leased' | 'reserved' | 'under_review' | 'unavailable'

export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed'

export type DecisionType = 'approved' | 'rejected' | 'deferred' | 'requires_revision'

export type FinancingMethod = 'savings' | 'bank_loan' | 'housing_scheme' | 'posf' | 'nasfund' | 'other'

export type ApplicantCategory = 'individual' | 'company' | 'government'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          role: UserRole
          department: string | null
          phone: string | null
          postal_address: string | null
          province: string | null
          district: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          role?: UserRole
          department?: string | null
          phone?: string | null
          postal_address?: string | null
          province?: string | null
          district?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: UserRole
          department?: string | null
          phone?: string | null
          postal_address?: string | null
          province?: string | null
          district?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      provinces: {
        Row: {
          id: number
          code: string
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          code: string
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          code?: string
          name?: string
          created_at?: string
        }
      }
      land_parcels: {
        Row: {
          id: string
          parcel_number: string
          name: string
          province_id: number | null
          district: string | null
          location_description: string
          area_hectares: number | null
          area_sqm: number | null
          coordinates: Json | null
          boundaries: Json | null
          status: ParcelStatus
          parcel_type: ApplicationType | null
          valuation_amount: number | null
          valuation_date: string | null
          last_survey_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parcel_number: string
          name: string
          province_id?: number | null
          district?: string | null
          location_description: string
          area_hectares?: number | null
          area_sqm?: number | null
          coordinates?: Json | null
          boundaries?: Json | null
          status?: ParcelStatus
          parcel_type?: ApplicationType | null
          valuation_amount?: number | null
          valuation_date?: string | null
          last_survey_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parcel_number?: string
          name?: string
          province_id?: number | null
          district?: string | null
          location_description?: string
          area_hectares?: number | null
          area_sqm?: number | null
          coordinates?: Json | null
          boundaries?: Json | null
          status?: ParcelStatus
          parcel_type?: ApplicationType | null
          valuation_amount?: number | null
          valuation_date?: string | null
          last_survey_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          application_number: string
          applicant_id: string | null
          application_type: ApplicationType
          status: ApplicationStatus
          submitted_at: string | null
          applicant_category: ApplicantCategory
          company_name: string | null
          first_name: string
          last_name: string
          email: string
          phone: string
          postal_address: string
          parcel_id: string | null
          province_id: number | null
          district: string | null
          location_description: string
          area_requested: number | null
          lease_duration_years: number | null
          intended_use: string
          development_description: string | null
          financing_method: FinancingMethod | null
          estimated_development_value: number | null
          assigned_officer_id: string | null
          land_board_meeting_id: string | null
          decision_date: string | null
          decision_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_number?: string
          applicant_id?: string | null
          application_type: ApplicationType
          status?: ApplicationStatus
          submitted_at?: string | null
          applicant_category: ApplicantCategory
          company_name?: string | null
          first_name: string
          last_name: string
          email: string
          phone: string
          postal_address: string
          parcel_id?: string | null
          province_id?: number | null
          district?: string | null
          location_description: string
          area_requested?: number | null
          lease_duration_years?: number | null
          intended_use: string
          development_description?: string | null
          financing_method?: FinancingMethod | null
          estimated_development_value?: number | null
          assigned_officer_id?: string | null
          land_board_meeting_id?: string | null
          decision_date?: string | null
          decision_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_number?: string
          applicant_id?: string | null
          application_type?: ApplicationType
          status?: ApplicationStatus
          submitted_at?: string | null
          applicant_category?: ApplicantCategory
          company_name?: string | null
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          postal_address?: string
          parcel_id?: string | null
          province_id?: number | null
          district?: string | null
          location_description?: string
          area_requested?: number | null
          lease_duration_years?: number | null
          intended_use?: string
          development_description?: string | null
          financing_method?: FinancingMethod | null
          estimated_development_value?: number | null
          assigned_officer_id?: string | null
          land_board_meeting_id?: string | null
          decision_date?: string | null
          decision_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      application_documents: {
        Row: {
          id: string
          application_id: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          uploaded_by: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          application_id?: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          application_id?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          uploaded_at?: string
        }
      }
      leases: {
        Row: {
          id: string
          lease_number: string
          application_id: string | null
          parcel_id: string
          leaseholder_id: string
          lease_type: ApplicationType
          start_date: string
          end_date: string
          duration_years: number
          annual_rent: number
          rent_reduction_percentage: number
          total_value: number | null
          status: LeaseStatus
          covenants: Json | null
          special_conditions: string | null
          last_inspection_date: string | null
          compliance_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lease_number?: string
          application_id?: string | null
          parcel_id: string
          leaseholder_id: string
          lease_type: ApplicationType
          start_date: string
          end_date: string
          duration_years: number
          annual_rent: number
          rent_reduction_percentage?: number
          total_value?: number | null
          status?: LeaseStatus
          covenants?: Json | null
          special_conditions?: string | null
          last_inspection_date?: string | null
          compliance_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lease_number?: string
          application_id?: string | null
          parcel_id?: string
          leaseholder_id?: string
          lease_type?: ApplicationType
          start_date?: string
          end_date?: string
          duration_years?: number
          annual_rent?: number
          rent_reduction_percentage?: number
          total_value?: number | null
          status?: LeaseStatus
          covenants?: Json | null
          special_conditions?: string | null
          last_inspection_date?: string | null
          compliance_status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      land_board_meetings: {
        Row: {
          id: string
          meeting_number: string
          meeting_date: string
          meeting_time: string
          location: string
          status: MeetingStatus
          chairman_id: string | null
          members: Json | null
          agenda_items: Json | null
          published_in_gazette: boolean | null
          gazette_date: string | null
          minutes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meeting_number: string
          meeting_date: string
          meeting_time: string
          location: string
          status?: MeetingStatus
          chairman_id?: string | null
          members?: Json | null
          agenda_items?: Json | null
          published_in_gazette?: boolean | null
          gazette_date?: string | null
          minutes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meeting_number?: string
          meeting_date?: string
          meeting_time?: string
          location?: string
          status?: MeetingStatus
          chairman_id?: string | null
          members?: Json | null
          agenda_items?: Json | null
          published_in_gazette?: boolean | null
          gazette_date?: string | null
          minutes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      land_board_decisions: {
        Row: {
          id: string
          meeting_id: string | null
          application_id: string
          decision_type: DecisionType
          decision_date: string
          decision_notes: string | null
          conditions: Json | null
          votes_for: number | null
          votes_against: number | null
          abstentions: number | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          meeting_id?: string | null
          application_id: string
          decision_type: DecisionType
          decision_date: string
          decision_notes?: string | null
          conditions?: Json | null
          votes_for?: number | null
          votes_against?: number | null
          abstentions?: number | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string | null
          application_id?: string
          decision_type?: DecisionType
          decision_date?: string
          decision_notes?: string | null
          conditions?: Json | null
          votes_for?: number | null
          votes_against?: number | null
          abstentions?: number | null
          created_by?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          link_url: string | null
          link_text: string | null
          application_id: string | null
          meeting_id: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          link_url?: string | null
          link_text?: string | null
          application_id?: string | null
          meeting_id?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          link_url?: string | null
          link_text?: string | null
          application_id?: string | null
          meeting_id?: string | null
          read_at?: string | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_type: string
          start_date: string
          end_date: string | null
          location: string | null
          meeting_id: string | null
          attendees: Json | null
          max_attendees: number | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_type: string
          start_date: string
          end_date?: string | null
          location?: string | null
          meeting_id?: string | null
          attendees?: Json | null
          max_attendees?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_type?: string
          start_date?: string
          end_date?: string | null
          location?: string | null
          meeting_id?: string | null
          attendees?: Json | null
          max_attendees?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      application_summary: {
        Row: {
          id: string
          application_number: string
          applicant_name: string
          email: string
          application_type: ApplicationType
          status: ApplicationStatus
          submitted_at: string | null
          province_name: string | null
          parcel_number: string | null
          parcel_name: string | null
          area_requested: number | null
          estimated_development_value: number | null
          created_at: string
        }
      }
      active_leases_summary: {
        Row: {
          id: string
          lease_number: string
          lease_type: ApplicationType
          parcel_number: string
          parcel_name: string
          area_hectares: number | null
          province_name: string | null
          start_date: string
          end_date: string
          annual_rent: number
          rent_reduction_percentage: number
          effective_annual_rent: number
          status: LeaseStatus
          years_remaining: number | null
        }
      }
      dashboard_statistics: {
        Row: {
          total_applications: number
          pending_review: number
          approved_applications: number
          active_leases: number
          expiring_soon: number
          applications_this_month: number
          total_annual_revenue: number | null
          available_parcels: number
        }
      }
      monthly_application_stats: {
        Row: {
          month: string
          total_applications: number
          approved: number
          rejected: number
          pending: number
          total_estimated_value: number | null
        }
      }
    }
    Functions: {
      generate_application_number: {
        Args: Record<string, never>
        Returns: string
      }
      generate_lease_number: {
        Args: Record<string, never>
        Returns: string
      }
    }
  }
}
