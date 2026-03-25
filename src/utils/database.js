import { supabase, supabaseService } from '../config/supabase.js';

// Users
export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const getUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  return { data, error };
};

export const createUser = async (userData) => {
  const { data, error } = await supabaseService
    .from('users')
    .insert([userData])
    .select()
    .single();
  return { data, error };
};

export const updateUser = async (id, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// Organizations
export const getOrganizations = async (filters = {}) => {
  let query = supabase.from('organizations').select('*');
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const getOrganizationById = async (id) => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const createOrganization = async (orgData) => {
  const { data, error } = await supabase
    .from('organizations')
    .insert([orgData])
    .select()
    .single();
  return { data, error };
};

export const updateOrganization = async (id, updates) => {
  const { data, error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// Branches
export const getBranches = async (orgId) => {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('organizationId', orgId);
  return { data, error };
};

export const getBranchById = async (id) => {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const createBranch = async (branchData) => {
  const { data, error } = await supabase
    .from('branches')
    .insert([branchData])
    .select()
    .single();
  return { data, error };
};

export const updateBranch = async (id, updates) => {
  const { data, error } = await supabase
    .from('branches')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// Staff
export const getStaff = async (filters = {}) => {
  let query = supabase.from('staff').select('*');
  
  if (filters.organizationId) {
    query = query.eq('organizationId', filters.organizationId);
  }
  if (filters.branchId) {
    query = query.eq('branchId', filters.branchId);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const getStaffById = async (id) => {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const createStaff = async (staffData) => {
  const { data, error } = await supabase
    .from('staff')
    .insert([staffData])
    .select()
    .single();
  return { data, error };
};

export const updateStaff = async (id, updates) => {
  const { data, error } = await supabase
    .from('staff')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// Devices
export const getDevices = async (filters = {}) => {
  let query = supabase.from('devices').select('*');
  
  if (filters.organizationId) {
    query = query.eq('organizationId', filters.organizationId);
  }
  if (filters.branchId) {
    query = query.eq('branchId', filters.branchId);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const getDeviceById = async (id) => {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const createDevice = async (deviceData) => {
  const { data, error } = await supabase
    .from('devices')
    .insert([deviceData])
    .select()
    .single();
  return { data, error };
};

export const updateDevice = async (id, updates) => {
  const { data, error } = await supabase
    .from('devices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// Services
export const getServices = async (orgId) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('organizationId', orgId);
  return { data, error };
};

export const createService = async (serviceData) => {
  const { data, error } = await supabase
    .from('services')
    .insert([serviceData])
    .select()
    .single();
  return { data, error };
};

export const updateService = async (id, updates) => {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteService = async (id) => {
  const { data, error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  return { data, error };
};

// Tickets
export const getTickets = async (filters = {}) => {
  let query = supabase.from('tickets').select('*');
  
  if (filters.branchId) {
    query = query.eq('branchId', filters.branchId);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.organizationId) {
    query = query.eq('organizationId', filters.organizationId);
  }
  
  const { data, error } = await query.order('createdAt', { ascending: false });
  return { data, error };
};

export const createTicket = async (ticketData) => {
  const { data, error } = await supabase
    .from('tickets')
    .insert([ticketData])
    .select()
    .single();
  return { data, error };
};

export const updateTicket = async (id, updates) => {
  const { data, error } = await supabase
    .from('tickets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// Queue
export const getQueueStatus = async (branchId) => {
  const { data, error } = await supabase
    .from('tickets')
    .select('status, COUNT(*)')
    .eq('branchId', branchId)
    .eq('date', new Date().toISOString().split('T')[0])
    .in('status', ['waiting', 'serving', 'completed', 'cancelled']);
  return { data, error };
};

// Audit Logs
export const createAuditLog = async (logData) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert([logData])
    .select()
    .single();
  return { data, error };
};

export const getAuditLogs = async (filters = {}, limit = 100) => {
  let query = supabase.from('audit_logs').select('*');
  
  if (filters.organizationId) {
    query = query.eq('organizationId', filters.organizationId);
  }
  if (filters.userId) {
    query = query.eq('userId', filters.userId);
  }
  if (filters.action) {
    query = query.eq('action', filters.action);
  }
  
  const { data, error } = await query.order('timestamp', { ascending: false }).limit(limit);
  return { data, error };
};

// Notifications
export const createNotification = async (notificationData) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notificationData])
    .select()
    .single();
  return { data, error };
};

export const getNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });
  return { data, error };
};

export const updateNotification = async (id, updates) => {
  const { data, error } = await supabase
    .from('notifications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};
