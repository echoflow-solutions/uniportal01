'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Receipt,
  Building,
  Wallet,
  ArrowRight,
  Shield,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// Mock fees data
const currentSemesterFees = {
  semester: 'Fall 2025',
  totalAmount: 15500,
  paidAmount: 10000,
  remainingAmount: 5500,
  dueDate: '2025-12-31',
  status: 'partial',
  breakdown: [
    { item: 'Tuition Fees', amount: 12000, category: 'tuition' },
    { item: 'Technology Fee', amount: 500, category: 'fees' },
    { item: 'Library Fee', amount: 200, category: 'fees' },
    { item: 'Student Activity Fee', amount: 300, category: 'fees' },
    { item: 'Laboratory Fee', amount: 800, category: 'fees' },
    { item: 'Registration Fee', amount: 200, category: 'fees' },
    { item: 'ID Card Fee', amount: 50, category: 'fees' },
    { item: 'Health Services Fee', amount: 450, category: 'fees' },
    { item: 'Examination Fee', amount: 500, category: 'fees' },
    { item: 'Miscellaneous', amount: 500, category: 'other' },
  ],
}

const paymentHistory = [
  {
    id: '1',
    date: '2025-09-15',
    amount: 5000,
    method: 'Bank Transfer',
    reference: 'TXN-2025-001234',
    status: 'completed',
    description: 'Fall 2025 - First Installment',
  },
  {
    id: '2',
    date: '2025-10-20',
    amount: 5000,
    method: 'Credit Card',
    reference: 'TXN-2025-001567',
    status: 'completed',
    description: 'Fall 2025 - Second Installment',
  },
  {
    id: '3',
    date: '2025-05-10',
    amount: 14500,
    method: 'Bank Transfer',
    reference: 'TXN-2025-000890',
    status: 'completed',
    description: 'Spring 2025 - Full Payment',
  },
  {
    id: '4',
    date: '2025-01-15',
    amount: 14000,
    method: 'Bank Transfer',
    reference: 'TXN-2025-000234',
    status: 'completed',
    description: 'Fall 2024 - Full Payment',
  },
]

const paymentPlans = [
  {
    id: 'full',
    name: 'Full Payment',
    description: 'Pay the entire balance now',
    amount: 5500,
    discount: 200,
    dueDate: 'Immediate',
  },
  {
    id: 'two',
    name: 'Two Installments',
    description: 'Split into 2 equal payments',
    amount: 2750,
    installments: 2,
    dueDate: 'Dec 15 & Dec 31',
  },
  {
    id: 'three',
    name: 'Three Installments',
    description: 'Split into 3 payments',
    amount: 1834,
    installments: 3,
    dueDate: 'Dec 10, 20 & 31',
    fee: 50,
  },
]

const financialAid = [
  {
    type: 'Merit Scholarship',
    amount: 2000,
    status: 'applied',
    semester: 'Fall 2025',
  },
  {
    type: 'Graduate Assistantship',
    amount: 3000,
    status: 'applied',
    semester: 'Fall 2025',
  },
]

export default function FeesPage() {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const paidPercentage = Math.round((currentSemesterFees.paidAmount / currentSemesterFees.totalAmount) * 100)
  const daysUntilDue = Math.ceil((new Date(currentSemesterFees.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fees & Payments</h1>
          <p className="text-slate-500 mt-1">Manage your tuition and payment information</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Statement
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600">
            <CreditCard className="h-4 w-4" />
            Make Payment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Fees</p>
                <p className="text-2xl font-bold text-blue-700">${currentSemesterFees.totalAmount.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">{currentSemesterFees.semester}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Amount Paid</p>
                <p className="text-2xl font-bold text-emerald-700">${currentSemesterFees.paidAmount.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 mt-1">{paidPercentage}% complete</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Balance Due</p>
                <p className="text-2xl font-bold text-amber-700">${currentSemesterFees.remainingAmount.toLocaleString()}</p>
                <p className="text-xs text-amber-600 mt-1">{daysUntilDue} days remaining</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Financial Aid</p>
                <p className="text-2xl font-bold text-purple-700">${financialAid.reduce((acc, aid) => acc + aid.amount, 0).toLocaleString()}</p>
                <p className="text-xs text-purple-600 mt-1">Applied to account</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{currentSemesterFees.semester} Payment Progress</h3>
              <p className="text-sm text-slate-500">Due by {new Date(currentSemesterFees.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <Badge className={daysUntilDue <= 14 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
              {daysUntilDue <= 14 ? <AlertTriangle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
              {daysUntilDue} days left
            </Badge>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-600">Payment Progress</span>
              <span className="font-semibold text-slate-900">${currentSemesterFees.paidAmount.toLocaleString()} of ${currentSemesterFees.totalAmount.toLocaleString()}</span>
            </div>
            <Progress value={paidPercentage} className="h-3" />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="mt-4 flex items-center gap-2 text-slate-600"
          >
            {showBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showBreakdown ? 'Hide' : 'View'} Fee Breakdown
          </Button>

          {showBreakdown && (
            <div className="mt-4 pt-4 border-t">
              <div className="space-y-2">
                {currentSemesterFees.breakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-700">{item.item}</span>
                    <span className="font-semibold text-slate-900">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Options */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment Options</h2>
          <div className="space-y-4">
            {paymentPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`border-2 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-transparent shadow-md hover:shadow-lg'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-900">{plan.name}</h3>
                        {plan.discount && (
                          <Badge className="bg-green-100 text-green-700">Save ${plan.discount}</Badge>
                        )}
                        {plan.fee && (
                          <Badge variant="outline" className="text-slate-500">+${plan.fee} fee</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{plan.description}</p>
                      <p className="text-xs text-slate-400 mt-2">Due: {plan.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">${plan.amount.toLocaleString()}</p>
                      {plan.installments && (
                        <p className="text-xs text-slate-500">per installment</p>
                      )}
                    </div>
                  </div>
                  {selectedPlan === plan.id && (
                    <Button className="w-full mt-4 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                      <CreditCard className="h-4 w-4" />
                      Proceed with {plan.name}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Accepted Payment Methods</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                <CreditCard className="h-4 w-4 text-slate-600" />
                <span className="text-sm text-slate-600">Credit/Debit Card</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                <Building className="h-4 w-4 text-slate-600" />
                <span className="text-sm text-slate-600">Bank Transfer</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                <Wallet className="h-4 w-4 text-slate-600" />
                <span className="text-sm text-slate-600">Mobile Money</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
              <Shield className="h-4 w-4" />
              <span>All payments are secure and encrypted</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Aid */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="h-5 w-5 text-purple-600" />
                Financial Aid
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {financialAid.map((aid, index) => (
                <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-purple-900">{aid.type}</span>
                    <Badge className="bg-green-100 text-green-700">Applied</Badge>
                  </div>
                  <p className="text-lg font-bold text-purple-700">${aid.amount.toLocaleString()}</p>
                  <p className="text-xs text-purple-500">{aid.semester}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full text-purple-600 border-purple-200 hover:bg-purple-50">
                Apply for More Aid
              </Button>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Payment Reminder</h3>
                  <p className="text-sm text-amber-700">
                    Please ensure all fees are paid by the due date to avoid late penalties and registration holds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Receipt className="h-5 w-5 text-blue-600" />
          Payment History
        </h2>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{payment.description}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{payment.method}</td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{payment.reference}</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-right">
                        ${payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4 text-slate-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
