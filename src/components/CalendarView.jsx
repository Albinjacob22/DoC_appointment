import { useState } from 'react';
import Calendar from 'react-calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppointmentModal from './AppointmentModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { LogOut, Plus, Calendar as CalendarIcon, Users, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import 'react-calendar/dist/Calendar.css';

const CalendarView = ({ onLogout }) => {
  const [appointments, setAppointments] = useLocalStorage('appointments', []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const isMobile = useIsMobile();

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEditingAppointment(null);
    setIsModalOpen(true);
  };

  const handleAddAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: crypto.randomUUID(),
    };
    setAppointments([...appointments, newAppointment]);
    setIsModalOpen(false);
    toast({
      title: "Appointment Added",
      description: `Appointment for ${appointment.patientName} has been scheduled.`,
    });
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setSelectedDate(appointment.date);
    setIsModalOpen(true);
  };

  const handleUpdateAppointment = (updatedAppointment) => {
    if (!editingAppointment) return;
    
    const updated = appointments.map(apt => 
      apt.id === editingAppointment.id 
        ? { ...updatedAppointment, id: editingAppointment.id }
        : apt
    );
    setAppointments(updated);
    setIsModalOpen(false);
    setEditingAppointment(null);
    toast({
      title: "Appointment Updated",
      description: `Appointment has been updated successfully.`,
    });
  };

  const handleDeleteAppointment = (appointmentId) => {
    const updated = appointments.filter(apt => apt.id !== appointmentId);
    setAppointments(updated);
    toast({
      title: "Appointment Deleted",
      description: "Appointment has been removed from the calendar.",
    });
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => 
      new Date(apt.date).toDateString() === date.toDateString()
    );
  };

  const getTodayAppointments = () => {
    return getAppointmentsForDate(selectedDate);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayAppointments = getAppointmentsForDate(date);
      if (dayAppointments.length > 0) {
        return (
          <div className="flex flex-wrap gap-1 mt-1">
            {dayAppointments.slice(0, 2).map((apt, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
            ))}
            {dayAppointments.length > 2 && (
              <div className="text-xs text-blue-600 font-medium">
                +{dayAppointments.length - 2}
              </div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HealthCare Calendar</h1>
                <p className="text-gray-600">Manage clinic appointments</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-3">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    {isMobile ? 'Daily View' : 'Monthly View'}
                  </CardTitle>
                  <Button 
                    onClick={() => handleDateClick(new Date())}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="calendar-container">
                  <Calendar
                    onChange={(value) => {
                      if (value instanceof Date) {
                        setSelectedDate(value);
                      }
                    }}
                    value={selectedDate}
                    onClickDay={handleDateClick}
                    tileContent={tileContent}
                    className="w-full border-0 bg-transparent"
                    view={isMobile ? "month" : "month"}
                    showNeighboringMonth={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Appointments */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  {selectedDate.toDateString() === new Date().toDateString() 
                    ? "Today's Appointments" 
                    : `Appointments for ${selectedDate.toLocaleDateString()}`
                  }
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getTodayAppointments().length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No appointments scheduled
                  </p>
                ) : (
                  getTodayAppointments()
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {appointment.patientName}
                          </h4>
                          <Badge variant="outline" className="text-blue-600">
                            {appointment.time}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Dr. {appointment.doctorName}
                        </p>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Appointments</span>
                  <Badge variant="secondary">{appointments.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Today's Total</span>
                  <Badge variant="secondary">
                    {getAppointmentsForDate(new Date()).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Selected Date</span>
                  <Badge variant="secondary">
                    {getTodayAppointments().length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Appointment Modal */}
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAppointment(null);
          }}
          onSave={editingAppointment ? handleUpdateAppointment : handleAddAppointment}
          onDelete={editingAppointment ? handleDeleteAppointment : undefined}
          selectedDate={selectedDate}
          editingAppointment={editingAppointment}
        />
      </div>
    </div>
  );
};

export default CalendarView;
