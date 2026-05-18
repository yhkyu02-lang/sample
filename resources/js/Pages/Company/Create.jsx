import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/layout/layout.jsx';
import CompanyForm from './CompanyForm';

const Create = ({ prefectures }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        postcode: '',
        prefecture_id: '',
        city: '',
        local: '',
        street_address: '',
        business_hour: '',
        regular_holiday: '',
        phone: '',
        fax: '',
        url: '',
        license_number: '',
        image: null,
    });

    const handleSubmit = () => {
        post(route('companies.store'), {
            forceFormData: true,
        });
    };

    return (
        <Layout>
            <Head title="会社新規作成" />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5>会社新規作成</h5>
                        <CompanyForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            onSubmit={handleSubmit}
                            prefectures={prefectures}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Create;
