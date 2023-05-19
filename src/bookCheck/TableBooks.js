import React, { useState } from 'react';
import { Table, Row, Rows } from 'react-native-table-component';
import { NativeBaseProvider, Radio, TextArea } from 'native-base';
import { View, StyleSheet } from 'react-native';

export default function TableBooks({ data }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const state = {
    HeadTable: ['nombre', 'Estado', 'observaciones'],
    DataTable: data
      ? data.map((item) => [
          item.name,
          [
            <Radio.Group
              name="estado"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <Radio value="bien" colorScheme="info">
                Bien
              </Radio>
              <Radio value="regular" colorScheme="orange" style={styles.radio}>
                Regular
              </Radio>
              <Radio value="mal" colorScheme="danger" style={styles.radio}>
                Dañado
              </Radio>
            </Radio.Group>,
          ],
          <TextArea>item.observaciones</TextArea>,
        ])
      : [],
  };

  return (
    <NativeBaseProvider>
      <View>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#ffa1d2' }}>
          <Row data={state.HeadTable} />
          <Rows data={state.DataTable} />
        </Table>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  radio: {
    marginTop: 8,
  },
});
