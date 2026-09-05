import React from 'react';
import { View } from 'react-native';
import { FieldReportForm } from '../../components/Reporting/FieldReportForm';

export default function ReportScreen() {
  return (
    <View className="flex-1 bg-background pt-12">
      <FieldReportForm />
    </View>
  );
}
