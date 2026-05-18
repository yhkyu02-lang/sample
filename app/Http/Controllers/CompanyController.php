<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use App\Models\Prefecture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::with('prefecture');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $companies = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Company/Index', [
            'companies' => $companies,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        $prefectures = Prefecture::all();

        return Inertia::render('Company/Create', [
            'prefectures' => $prefectures,
        ]);
    }

    public function store(StoreCompanyRequest $request)
    {
        $data = $request->validated();
        unset($data['image']);

        $company = Company::create($data);

        // Save image as Image_{id}.png
        if ($request->hasFile('image')) {
            $filename = "Image_{$company->id}.png";
            $request->file('image')->storeAs('companies', $filename, 'public');
            $company->update(['image' => "companies/{$filename}"]);
        }

        return redirect()->route('companies.index')->with('success', 'Company created successfully.');
    }

    public function edit(Company $company)
    {
        $prefectures = Prefecture::all();

        return Inertia::render('Company/Edit', [
            'company' => $company,
            'prefectures' => $prefectures,
        ]);
    }

    public function update(UpdateCompanyRequest $request, Company $company)
    {
        $data = $request->validated();
        unset($data['image']);

        // Save image as Image_{id}.png
        if ($request->hasFile('image')) {
            // Delete old image
            if ($company->image) {
                Storage::disk('public')->delete($company->image);
            }
            $filename = "Image_{$company->id}.png";
            $request->file('image')->storeAs('companies', $filename, 'public');
            $data['image'] = "companies/{$filename}";
        }

        $company->update($data);

        return redirect()->route('companies.index')->with('success', 'Company updated successfully.');
    }

    public function destroy(Company $company)
    {
        // Delete image
        if ($company->image) {
            Storage::disk('public')->delete($company->image);
        }

        $company->delete();

        return redirect()->route('companies.index')->with('success', 'Company deleted successfully.');
    }
}
