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
                        <RadioGroup defaultValue="good" orientation="horizontal" className="flex gap-4">
                            {/* Good */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <RadioGroupItem
                                value="good"
                                id="r1"
                                className="
                                    border-gray-400 
                                    transition-colors duration-200
                                    data-[state=checked]:border-green-500 
                                    data-[state=checked]:bg-green-500
                                    data-[state=checked]:text-white
                                "
                                />
                                <p>Good</p>
                            </label>

                            {/* Acceptable */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <RadioGroupItem
                                value="acceptable"
                                id="r2"
                                className="
                                    border-gray-400 
                                    transition-colors duration-200
                                    data-[state=checked]:border-yellow-500 
                                    data-[state=checked]:bg-yellow-500
                                "
                                />
                                <p>Acceptable</p>
                            </label>

                            {/* Bad */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <RadioGroupItem
                                value="bad"
                                id="r3"
                                className="
                                    border-gray-400 
                                    transition-colors duration-200
                                    data-[state=checked]:border-red-500 
                                    data-[state=checked]:bg-red-500
                                "
                                />
                                <p>Bad</p>
                            </label>
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
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <RadioGroupItem 
                                    value="within a few hours" 
                                    id="r1" 
                                    className="
                                    border-gray-400 
                                    transition-colors duration-200
                                    data-[state=checked]:border-red-500 
                                    data-[state=checked]:bg-red-500
                                    "/>
                                    <p>within a few hours</p>
                                </label>
                                
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <RadioGroupItem 
                                        value="1-2 days" 
                                        id="r2" 
                                        className="
                                            border-gray-400 
                                            transition-colors duration-200
                                            data-[state=checked]:border-red-500 
                                            data-[state=checked]:bg-red-500
                                            "/>
                                        <p>1-2 days</p>
                                </label>

                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <RadioGroupItem 
                                        value="2-3 days" 
                                        id="r3"
                                        className="
                                            border-gray-400 
                                            transition-colors duration-200
                                            data-[state=checked]:border-red-500 
                                            data-[state=checked]:bg-red-500
                                            " />
                                    <p>2-3 days</p>
                                </label>

                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <RadioGroupItem 
                                        value="more than 4 days" 
                                        id="r4" 
                                        className="
                                            border-gray-400 
                                            transition-colors duration-200
                                            data-[state=checked]:border-red-500 
                                            data-[state=checked]:bg-red-500
                                            " />
                                    <p>more than 4 days</p>
                                </label>
                                
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