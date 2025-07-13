import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '../components/Ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PATIENTS, DOCTORS } from '../data/staticData';
import { Trash2, Save, User, Stethoscope, Clock } from 'lucide-react';

const AppointmentModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  editingAppointment
}) => {
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [time, setTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingAppointment) {
      setPatientName(editingAppointment.patientName);
      setDoctorName(editingAppointment.doctorName);
      setTime(editingAppointment.time);
    } else {
      setPatientName('');
      setDoctorName('');
      setTime('');
    }
  }, [editingAppointment, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const appointment = {
      patientName,
      doctorName,
      time,
      date: selectedDate,
    };

    onSave(appointment);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (editingAppointment && onDelete) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      onDelete(editingAppointment.id);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Date:</strong> {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient" className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              Patient
            </Label>
            <Select value={patientName} onValueChange={setPatientName} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {PATIENTS.map((patient) => (
                  <SelectItem key={patient.id} value={patient.name}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-gray-500" />
              Doctor
            </Label>
            <Select value={doctorName} onValueChange={setDoctorName} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {DOCTORS.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.name}>
                    Dr. {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingAppointment ? 'Update' : 'Save'}
                </>
              )}
            </Button>

            {editingAppointment && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="px-3"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
