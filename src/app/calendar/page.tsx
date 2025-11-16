'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'

const events = [
  {
    id: 1,
    title: 'Land Board Meeting - Regular Session',
    date: new Date(2025, 0, 20),
    time: '9:00 AM - 4:00 PM',
    location: 'Department of Lands, Port Moresby',
    type: 'meeting',
    attendees: 12,
    description: 'Regular Land Board meeting to consider new lease applications'
  },
  {
    id: 2,
    title: 'Application Deadline - January Batch',
    date: new Date(2025, 0, 15),
    time: '5:00 PM',
    location: 'Online Submission',
    type: 'deadline',
    description: 'Last day to submit applications for January Land Board meeting'
  },
  {
    id: 3,
    title: 'Lease Renewal Workshop',
    date: new Date(2025, 0, 25),
    time: '10:00 AM - 2:00 PM',
    location: 'Training Room A',
    type: 'workshop',
    attendees: 30,
    description: 'Workshop for leaseholders on renewal processes and requirements'
  },
  {
    id: 4,
    title: 'Land Board Meeting - Special Session',
    date: new Date(2025, 1, 5),
    time: '9:00 AM - 12:00 PM',
    location: 'Department of Lands, Port Moresby',
    type: 'meeting',
    attendees: 12,
    description: 'Special session for urgent lease considerations'
  },
  {
    id: 5,
    title: 'GIS Training for Staff',
    date: new Date(2025, 1, 10),
    time: '1:00 PM - 4:00 PM',
    location: 'Computer Lab',
    type: 'training',
    attendees: 15,
    description: 'Training session on GIS system usage and land mapping'
  },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date))
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-emerald-500'
      case 'deadline': return 'bg-red-500'
      case 'workshop': return 'bg-blue-500'
      case 'training': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'deadline': return 'bg-red-100 text-red-800 border-red-300'
      case 'workshop': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'training': return 'bg-purple-100 text-purple-800 border-purple-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Events Calendar</h1>
        <p className="text-gray-600 mt-1">Land Board meetings, deadlines, and important events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{format(currentDate, 'MMMM yyyy')}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map(day => {
                const dayEvents = getEventsForDate(day)
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
                const isCurrentDay = isToday(day)

                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      min-h-20 p-2 rounded-lg border-2 transition-all
                      ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}
                      ${!isSameMonth(day, currentDate) ? 'opacity-40' : ''}
                      ${isCurrentDay ? 'bg-blue-50 border-blue-300' : ''}
                    `}
                  >
                    <div className={`text-sm font-semibold ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`${getEventColor(event.type)} h-1.5 rounded-full`}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-600">+{dayEvents.length - 2}</div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a Date'}
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <Badge className={getEventBadge(event.type)} variant="outline">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                      {event.attendees && (
                        <div className="flex items-center gap-2">
                          <Users size={14} />
                          <span>{event.attendees} attendees</span>
                        </div>
                      )}
                      <p className="text-xs mt-2">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon size={48} className="mx-auto mb-2 opacity-20" />
                <p>No events scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>All scheduled events and important dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map(event => (
                <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`${getEventColor(event.type)} p-3 rounded-lg text-white shrink-0`}>
                    <CalendarIcon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-gray-600">{format(event.date, 'EEEE, MMMM d, yyyy')}</p>
                      </div>
                      <Badge className={getEventBadge(event.type)} variant="outline">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                      {event.attendees && (
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{event.attendees} attendees</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
