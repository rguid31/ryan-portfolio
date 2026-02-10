import { getPersonalInfo } from '@/lib/masterReport';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
    const personal = getPersonalInfo();

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-5xl font-bold mb-8">Get In Touch</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl">
                {/* Contact Information */}
                <div>
                    <h2 className="text-3xl font-semibold mb-6">Contact Information</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-xl mb-2">Email</h3>
                            <a href={`mailto:${personal.contact.email}`} className="text-blue-600 hover:underline text-lg">
                                {personal.contact.email}
                            </a>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mb-2">Location</h3>
                            <p className="text-gray-700 text-lg">
                                {personal.location.city}, {personal.location.state}
                            </p>
                        </div>

                        {personal.social.linkedin && (
                            <div>
                                <h3 className="font-bold text-xl mb-2">LinkedIn</h3>
                                <a href={personal.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-lg">
                                    View Profile
                                </a>
                            </div>
                        )}

                        {personal.social.github && (
                            <div>
                                <h3 className="font-bold text-xl mb-2">GitHub</h3>
                                <a href={personal.social.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-lg">
                                    @{personal.social.github.split('/').pop()}
                                </a>
                            </div>
                        )}

                        <div>
                            <h3 className="font-bold text-xl mb-2">Availability</h3>
                            <p className="text-gray-700 text-lg">{personal.availability.status}</p>
                            <p className="text-gray-600 mt-2">Start Date: {personal.availability.startDate}</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <ContactForm email={personal.contact.email} />
            </div>
        </div>
    );
}