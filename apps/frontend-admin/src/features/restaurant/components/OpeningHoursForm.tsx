import { TimePicker, Switch, Button } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Plus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { updateRestaurantInfo } from '../api.service';
import type { OpeningDayDto } from '../dto/restaurant.dto';
import SubmitButton from '../../../shared/components/SubmitButton';

type OpeningHoursFormProps = {
  data: OpeningDayDto[];
  onSubmitSuccessful: () => void;
};
const OpeningHoursForm: React.FC<OpeningHoursFormProps> = ({ data, onSubmitSuccessful }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hours, setHours] = useState<OpeningDayDto[]>(data);

  useEffect(() => {
    setHours(data);
  }, [data]);

  // Handlers

  const toggleDay = (index: number) => {
    setHours(prev => prev.map((item, i) =>
      i === index ? { ...item, open: !item.open } : item
    ));
  };

  const addWindow = (dayIndex: number) => {
    setHours(prev => prev.map((day, i) =>
      i === dayIndex ? { ...day, windows: [...day.windows, { from: "12:00", to: "14:00" }] } : day
    ));
  };

  const removeWindow = (dayIndex: number, windowIndex: number) => {
    setHours(prev => prev.map((day, i) => {
      if (i !== dayIndex) return day;
      return { ...day, windows: day.windows.filter((_, j) => j !== windowIndex) };
    }));
  };

  const updateWindow = (dayIndex: number, windowIndex: number, values: [Dayjs | null, Dayjs | null] | null) => {
    if (!values || !values[0] || !values[1]) return;

    setHours(prev => prev.map((day, i) => {
      if (i !== dayIndex) return day;
      const newWindows = day.windows.map((win, j) =>
        j === windowIndex ? { from: values[0]!.format("HH:mm"), to: values[1]!.format("HH:mm") } : win
      );
      return { ...day, windows: newWindows };
    }));
  };

  // Submit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    updateRestaurantInfo({ openingHours: hours }).then(() => {
      onSubmitSuccessful()
    })
    .catch((error) => {
      setError('Failed to update restaurant opening hours: ' + error.message);
    })
    .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 w-full border-b py-2">Horaires d'ouverture</h2>
      {hours.map((item, dayIndex) => (
        <div key={item.day} className="mb-4">
          <div className="flex gap-4 items-center mb-2">
            <Switch
              checked={item.open}
              onChange={() => toggleDay(dayIndex)}
            />
            <h3 style={{ width: 80, display: 'inline-block' }}>{item.day}</h3>

            <Button
              className="ml-auto"
              type="dashed"
              disabled={!item.open || item.windows.length > 2}
              onClick={() => addWindow(dayIndex)}
            >
              <Plus />Ajouter un créneau
            </Button>
          </div>

          {item.open ? (
            <div>
              {item.windows.length > 0 ? (
                item.windows.map((win, winIndex) => (
                  <div key={winIndex} className="flex items-center mb-2">
                    <TimePicker.RangePicker
                      format="HH:mm"
                      minuteStep={15}
                      value={[dayjs(win.from, "HH:mm"), dayjs(win.to, "HH:mm")]}
                      onChange={(values) => updateWindow(dayIndex, winIndex, values)}
                    />
                    <Button type="text" onClick={() => removeWindow(dayIndex, winIndex)}>
                      <Trash size={16} className="text-red-500" />
                    </Button>
                  </div>
                ))
              ) : (
                <React.Fragment>
                  <p>Ouvert</p>
                </React.Fragment>
              )}
            </div>
          ) : (
            <div>
              <p className="text-gray-400">Fermé</p>
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-end pt-4">
        {error && <p className="text-red-500 mr-4">{error}</p>}
        <SubmitButton htmlType="submit" loading={loading} />
      </div>
    </form>
  )
}

export default OpeningHoursForm
