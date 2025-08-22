import React, { useState } from 'react';
import { Badge } from '../components/shared/Badge';

interface ScamType {
  id: string;
  name: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  howItWorks: string[];
  warningSignsIndicators: string[];
  preventionTips: string[];
  whatToDo: string[];
  realExample?: string;
}

const scamDatabase: ScamType[] = [
  {
    id: 'phishing',
    name: 'Phishing Scams',
    severity: 'high',
    description: 'Fraudulent attempts to obtain sensitive information by disguising as a trustworthy entity.',
    howItWorks: [
      'Scammers send fake emails or texts that appear to be from legitimate companies',
      'Messages contain urgent requests or threats to create panic',
      'Links redirect to fake websites that steal your information',
      'Attachments may contain malware that infects your device'
    ],
    warningSignsIndicators: [
      'Generic greetings like "Dear Customer" instead of your name',
      'Poor grammar and spelling mistakes',
      'Urgent deadlines or threats',
      'Suspicious sender email addresses',
      'Links that don\'t match the company\'s official domain'
    ],
    preventionTips: [
      'Always verify sender identity before clicking links',
      'Hover over links to preview the actual URL',
      'Log in to accounts directly through official websites',
      'Enable two-factor authentication on all accounts',
      'Keep software and antivirus programs updated'
    ],
    whatToDo: [
      'Do not click any links or download attachments',
      'Report the email as spam/phishing',
      'Delete the message immediately',
      'If you clicked a link, change your passwords immediately',
      'Monitor your accounts for suspicious activity'
    ],
    realExample: 'A fake Amazon email claiming your account will be suspended unless you "verify" your payment information within 24 hours.'
  },
  {
    id: 'tech-support',
    name: 'Tech Support Scams',
    severity: 'high',
    description: 'Scammers pose as technical support from well-known companies to gain remote access to your device.',
    howItWorks: [
      'Pop-ups or calls claim your computer is infected',
      'Scammers request remote access to "fix" the problem',
      'They install malware or steal personal information',
      'Often demand payment for fake services'
    ],
    warningSignsIndicators: [
      'Unsolicited calls about computer problems',
      'Pop-ups with phone numbers to call',
      'Requests for remote access to your device',
      'Demands for payment via gift cards',
      'Claims that only they can fix the issue'
    ],
    preventionTips: [
      'Never give control of your computer to unsolicited callers',
      'Use legitimate antivirus software',
      'Keep your operating system updated',
      'Block pop-ups in your browser',
      'Only contact tech support through official channels'
    ],
    whatToDo: [
      'Hang up immediately',
      'Never grant remote access',
      'Run a full antivirus scan',
      'Report to FTC at reportfraud.ftc.gov',
      'Contact your bank if you shared financial information'
    ]
  },
  {
    id: 'romance',
    name: 'Romance Scams',
    severity: 'high',
    description: 'Criminals create fake online profiles to build romantic relationships and eventually steal money.',
    howItWorks: [
      'Scammers create attractive fake profiles on dating sites',
      'They build emotional connections over weeks or months',
      'Eventually request money for emergencies or travel',
      'May send fake documents or photos to seem legitimate'
    ],
    warningSignsIndicators: [
      'Professes love unusually quickly',
      'Never available to meet in person or video chat',
      'Asks for money, gifts, or financial information',
      'Stories don\'t add up or change frequently',
      'Requests to move conversation off the dating platform'
    ],
    preventionTips: [
      'Never send money to someone you haven\'t met in person',
      'Research the person\'s photo and profile using reverse image search',
      'Stay on the dating platform\'s messaging system',
      'Be cautious of people who seem too perfect',
      'Video chat before developing deep feelings'
    ],
    whatToDo: [
      'Stop all contact immediately',
      'Report the profile to the dating platform',
      'File a complaint with the FBI\'s IC3',
      'Contact your bank if you sent money',
      'Seek emotional support from friends or counseling'
    ]
  },
  {
    id: 'lottery',
    name: 'Lottery & Prize Scams',
    severity: 'medium',
    description: 'Fake notifications claiming you\'ve won a prize or lottery you never entered.',
    howItWorks: [
      'You receive notification of winning a prize you didn\'t enter',
      'Scammers request fees or taxes to claim the prize',
      'May ask for bank account details for "deposit"',
      'Sometimes send fake checks that later bounce'
    ],
    warningSignsIndicators: [
      'Winning a contest you never entered',
      'Requests for payment to claim prizes',
      'Asking for bank account or credit card numbers',
      'Pressure to act quickly',
      'Poor grammar in official-looking documents'
    ],
    preventionTips: [
      'Remember: legitimate prizes don\'t require payment',
      'Never give financial information to claim a prize',
      'Research the organization independently',
      'Be skeptical of unexpected winnings',
      'Check with consumer protection agencies'
    ],
    whatToDo: [
      'Delete the message or hang up',
      'Don\'t provide any personal information',
      'Report to consumer protection agencies',
      'Warn friends and family about the scam',
      'Block the sender\'s contact information'
    ]
  },
  {
    id: 'investment',
    name: 'Investment & Cryptocurrency Scams',
    severity: 'high',
    description: 'Fraudulent investment opportunities promising high returns with little or no risk.',
    howItWorks: [
      'Promise of guaranteed high returns with no risk',
      'Pressure to invest immediately',
      'Complex strategies that are hard to understand',
      'Ponzi schemes paying early investors with new investor money'
    ],
    warningSignsIndicators: [
      'Guaranteed profits or no risk claims',
      'Pressure to invest immediately',
      'Unregistered investments',
      'Overly complex strategies',
      'Difficulty getting your money back'
    ],
    preventionTips: [
      'Research all investments thoroughly',
      'Verify registration with financial regulators',
      'Be skeptical of guaranteed returns',
      'Understand what you\'re investing in',
      'Get everything in writing'
    ],
    whatToDo: [
      'Stop sending money immediately',
      'Document all communications',
      'Report to SEC or CFTC',
      'File a complaint with your state regulator',
      'Consult with a financial advisor or attorney'
    ]
  },
  {
    id: 'grandparent',
    name: 'Grandparent Scams',
    severity: 'medium',
    description: 'Scammers pose as grandchildren in distress needing immediate financial help.',
    howItWorks: [
      'Caller claims to be a grandchild in trouble',
      'Creates urgency with arrest or accident story',
      'Requests money be sent immediately',
      'Asks to keep it secret from other family members'
    ],
    warningSignsIndicators: [
      'Caller can\'t answer personal questions',
      'Requests for secrecy',
      'Demands for immediate wire transfers',
      'Voice doesn\'t sound quite right',
      'Story seems unlikely or extreme'
    ],
    preventionTips: [
      'Verify by calling the grandchild directly',
      'Ask questions only they would know',
      'Call other family members to confirm',
      'Never send money immediately',
      'Be suspicious of requests for secrecy'
    ],
    whatToDo: [
      'Hang up and call your grandchild directly',
      'Contact other family members',
      'Report to local police',
      'File a complaint with the FTC',
      'Warn other elderly friends and family'
    ]
  }
];

export const LearningHub: React.FC = () => {
  const [selectedScam, setSelectedScam] = useState<ScamType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredScams = scamDatabase.filter(scam =>
    scam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scam.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'info';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Hub</h1>
        <p className="text-gray-600">
          Learn how to identify and protect yourself from common scams
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <svg className="w-10 h-10 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <div>
              <p className="text-2xl font-bold text-gray-900">{scamDatabase.length}</p>
              <p className="text-sm text-gray-600">Scam Types Covered</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <svg className="w-10 h-10 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {scamDatabase.filter(s => s.severity === 'high').length}
              </p>
              <p className="text-sm text-gray-600">High Risk Scams</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <svg className="w-10 h-10 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="text-2xl font-bold text-gray-900">24/7</p>
              <p className="text-sm text-gray-600">Protection Tips</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for scam types..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scam Type List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Scam Types</h2>
          <div className="space-y-3">
            {filteredScams.map((scam) => (
              <div
                key={scam.id}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedScam?.id === scam.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedScam(scam)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{scam.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{scam.description}</p>
                  </div>
                  <Badge variant={getSeverityVariant(scam.severity)} className="ml-2">
                    {scam.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2">
          {selectedScam ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedScam.name}</h2>
                  <Badge variant={getSeverityVariant(selectedScam.severity)}>
                    {selectedScam.severity.toUpperCase()} RISK
                  </Badge>
                </div>
                <p className="text-gray-700">{selectedScam.description}</p>
              </div>

              {selectedScam.realExample && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Real Example</h3>
                  <p className="text-blue-800 text-sm">{selectedScam.realExample}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    How It Works
                  </h3>
                  <ul className="space-y-2">
                    {selectedScam.howItWorks.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-700 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Warning Signs
                  </h3>
                  <ul className="space-y-2">
                    {selectedScam.warningSignsIndicators.map((sign, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Prevention Tips
                  </h3>
                  <ul className="space-y-2">
                    {selectedScam.preventionTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    What To Do If You Encounter This Scam
                  </h3>
                  <ul className="space-y-2">
                    {selectedScam.whatToDo.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-amber-200 text-amber-800 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-amber-800">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Scam Type</h3>
              <p className="text-gray-600">Choose a scam type from the list to learn more about how to protect yourself</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="#" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
            <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Report Fraud</h3>
              <p className="text-sm text-gray-600">FTC: reportfraud.ftc.gov</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
            <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">FBI IC3</h3>
              <p className="text-sm text-gray-600">Internet Crime Complaint Center</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
            <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Elder Fraud Hotline</h3>
              <p className="text-sm text-gray-600">1-833-FRAUD-11</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
            <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Identity Theft</h3>
              <p className="text-sm text-gray-600">identitytheft.gov</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
