'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {StarRating} from '@/components/ui/star_rating'
import { Input } from '@/components/ui/input';
import { RadioGroup , RadioGroupItem} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue, 
} from '@/components/ui/select';

export default function Feedback(){

    interface feedback_data {
        complaint: string; // use string for now since no database implementation yet
        rating: number;
        comment: string;
        repair_quality: string;
        response_speed: number;
    }

    const complaints = [
    {
      id: 1,
      title: 'Broken Air Conditioner in Room B-305',
      category: 'Room Maintenance',
      status: 'In Progress',
      date: 'Oct 28, 2024',
    },
    {
      id: 2,
      title: 'Water Leakage from Bathroom Ceiling',
      category: 'Plumbing',
      status: 'Pending',
      date: 'Oct 27, 2024',
    },
    {
      id: 3,
      title: 'Non-Functional Study Room Light',
      category: 'Common Areas',
      status: 'Resolved',
      date: 'Oct 25, 2024',
    },
  ];

    const [selectedComplaint, setSelectedComplaint] = useState("");
    const [rating, setRating] = useState(0);

    return(
        <div className='max-w-3xl mx-auto space-y-6'>
            
            {/* Page Heading */}
            <div className='py-2'>
                <h1 className="text-3xl font-bold text-gray-900">Feedback Form</h1>
                <p className="text-gray-600 mt-1">Please leave a feedback to improve our service!</p>
            </div>
            
            {/* Feedback Form */}
            <form className='bg-white rounded-lg shadow-sm border border-gray-200 sm:p-8 space-y-6'>
                <div className='pb-5'>
                    <div className='pb-2'>
                        <h1 className=''>Complaint</h1>
                    </div>
                    <div className='justify-start w-150'>
                         <Select onValueChange={(value) => setSelectedComplaint(value)}>
                            <SelectTrigger className="w-full">
                            <SelectValue placeholder="Which Complaint are you referring to?" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Complaints</SelectLabel>
                                {complaints.map((role) => (
                                <SelectItem key={role.id} value={role.title}>
                                    {role.title}
                                </SelectItem>
                                ))}
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className='pb-5'>
                    <div className='pb-2'>
                        <h1 className=''>Rating</h1>
                    </div>
                    <div className='justify-start w-150'>
                        <StarRating value={rating} onChange={setRating} />
                    </div>
                </div>
                <div className='pb-5'>
                    <div className='pb-2'>
                        <h1 className=''>Comment</h1>
                    </div>
                    <div className='justify-start w-150'>
                        <Input>

                        </Input>
                    </div>
                </div>
                <div className='pb-5'>
                    <div className='pb-2'>
                        <h1 className=''>Repair Quality</h1>
                    </div>
                    <div className='justify-start w-150'>
                        <RadioGroup orientation='horizontal' defaultValue="good">
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="good" id="r1" />
                                <p>good</p>
                                <RadioGroupItem value="acceptable" id="r2" />
                                <p>acceptable</p>
                                <RadioGroupItem value="bad" id="r3" />
                                <p>bad</p>
                            </div>
                            
                        </RadioGroup>
                    </div>
                </div>
                <div className='pb-5'>
                    <div className='pb-2'>
                        <h1 className=''>Response Speed</h1>
                    </div>
                    <div className='justify-start w-150'>
                        <RadioGroup orientation='horizontal' defaultValue="comfortable">
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="within a few hours" id="r1" />
                                <p>within a few hours</p>
                                <RadioGroupItem value="1-2 days" id="r2" />
                                <p>1-2 days</p>
                                <RadioGroupItem value="2-3 days" id="r3" />
                                <p>2-3 days</p>
                                <RadioGroupItem value="more than 4 days" id="r4" />
                                <p>more than 4 days</p>
                            </div>
                            
                        </RadioGroup>
                    </div>
                </div>
                <div>
                    <Button>
                        Submit
                    </Button>
                </div>
            </form>
            </div>
    );
}