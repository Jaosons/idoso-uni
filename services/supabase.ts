import "react-native-url-polyfill";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ftqkfroprtjsbgljcdih.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cWtmcm9wcnRqc2JnbGpjZGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExODQ2MTksImV4cCI6MjA0Njc2MDYxOX0.ZruhpelXcatqrZlhKh8N-fSrBf6UgtyHxVTqFnl87jI"

export const supabase = createClient(supabaseUrl, supabaseKey);