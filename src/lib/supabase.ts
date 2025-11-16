import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Table accessors using RPC functions
// Tables are in 'land_admin' schema, accessed via RPC functions in public schema

interface ApplicationInsertData {
  application_type: string
  applicant_category: string
  status: string
  company_name: string | null
  first_name: string
  last_name: string
  email: string
  phone: string
  postal_address: string
  province_id: number | null
  district: string | null
  location_description: string
  area_requested: number | null
  lease_duration_years: number | null
  intended_use: string
  development_description: string
  financing_method: string | null
  estimated_development_value: number | null
  submitted_at: string
}

export const db = {
  provinces: () => ({
    select: async (columns: string = '*') => {
      return await supabase.rpc('get_provinces')
    }
  }),

  landParcels: () => ({
    select: async (columns: string = '*') => {
      return await supabase.rpc('get_land_parcels')
    }
  }),

  applications: () => ({
    select: async (columns: string = '*') => {
      return await supabase.rpc('get_applications')
    },
    insert: async (data: ApplicationInsertData) => {
      // @ts-expect-error - RPC function types not generated yet
      const result = await supabase.rpc('insert_application', {
        p_application_type: data.application_type,
        p_applicant_category: data.applicant_category,
        p_status: data.status,
        p_company_name: data.company_name,
        p_first_name: data.first_name,
        p_last_name: data.last_name,
        p_email: data.email,
        p_phone: data.phone,
        p_postal_address: data.postal_address,
        p_province_id: data.province_id,
        p_district: data.district,
        p_location_description: data.location_description,
        p_area_requested: data.area_requested,
        p_lease_duration_years: data.lease_duration_years,
        p_intended_use: data.intended_use,
        p_development_description: data.development_description,
        p_financing_method: data.financing_method,
        p_estimated_development_value: data.estimated_development_value,
        p_submitted_at: data.submitted_at
      })
      return { data: result.data, error: result.error, select: () => ({ single: async () => result }) }
    }
  }),

  events: () => ({
    select: async (columns: string = '*') => {
      return await supabase.rpc('get_events')
    }
  }),

  // Placeholder for other tables (not yet implemented)
  profiles: () => ({ select: async () => ({ data: [], error: null }) }),
  leases: () => ({ select: async () => ({ data: [], error: null }) }),
  landBoardMeetings: () => ({ select: async () => ({ data: [], error: null }) }),
  landBoardDecisions: () => ({ select: async () => ({ data: [], error: null }) }),
  notifications: () => ({ select: async () => ({ data: [], error: null }) }),
  applicationDocuments: () => ({ select: async () => ({ data: [], error: null }) }),
}

// Views are in public schema and accessible directly
export const views = {
  applicationSummary: () => supabase.from('application_summary'),
  activeLeaseSummary: () => supabase.from('active_leases_summary'),
  dashboardStatistics: () => supabase.from('dashboard_statistics'),
  monthlyStats: () => supabase.from('monthly_application_stats'),
}
