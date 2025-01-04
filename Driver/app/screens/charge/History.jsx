import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function History({ transactions }) {

  const generateInvoice = async (transaction) => {
    const htmlContent = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            margin: 0;
            color: #333;
          }
          h1 {
            text-align: center;
            color: #007bff;
            margin-bottom: 40px;
          }
          .company-name {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: #00AB82;
            margin-bottom: 20px;
          }
          .invoice-section {
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
          }
          .section-title {
            font-size: 20px;
            color: #555;
            margin-bottom: 15px;
            text-decoration: underline;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .label {
            font-weight: bold;
            color: #333;
          }
          .value {
            color: #555;
          }
          .address-section {
            margin-bottom: 30px;
            border-bottom: 1px solid #ddd;
          }
          .address-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          .address-details {
            font-size: 16px;
            color: #555;
            margin-bottom: 5px;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #aaa;
            margin-top: 40px;
            border-top: 1px solid #eee;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1>Invoice</h1>
        <div class="company-name">Electrafind</div>
        
        <div class="address-section">
          <div class="address-title">Billing Address</div>
          <div class="address-details">John Doe</div>
          <div class="address-details">123 Main Street</div>
          <div class="address-details">City, State, ZIP</div>
          <div class="address-details">Country</div>
        </div>

        <div class="invoice-section">
          <div class="section-title">Transaction Details</div>
          <div class="info-row">
            <div class="label">Transaction ID:</div>
            <div class="value">${transaction.id}</div>
          </div>
          <div class="info-row">
            <div class="label">Date:</div>
            <div class="value">${transaction.date}</div>
          </div>
          <div class="info-row">
            <div class="label">Reference:</div>
            <div class="value">${transaction.reference}</div>
          </div>
          <div class="info-row">
            <div class="label">Amount:</div>
            <div class="value">${transaction.amount}</div>
          </div>
        </div>

        <div class="invoice-section">
          <div class="section-title">Charging Details</div>
          <div class="info-row">
            <div class="label">Start Time:</div>
            <div class="value">${transaction.startTime}</div>
          </div>
          <div class="info-row">
            <div class="label">End Time:</div>
            <div class="value">${transaction.endTime}</div>
          </div>
          <div class="info-row">
            <div class="label">Duration:</div>
            <div class="value">${transaction.duration}</div>
          </div>
          <div class="info-row">
            <div class="label">Energy Delivered:</div>
            <div class="value">${transaction.energyDelivered}</div>
          </div>
          <div class="info-row">
            <div class="label">Status:</div>
            <div class="value">${transaction.status}</div>
          </div>
        </div>

        <div class="invoice-section">
          <div class="section-title">Payment Summary</div>
          <div class="info-row">
            <div class="label">Subtotal:</div>
            <div class="value">${transaction.amount}</div>
          </div>
          <div class="info-row">
            <div class="label">Tax (10%):</div>
            <div class="value">Rs. ${(parseFloat(transaction.amount.replace(/[^0-9.-]+/g,"")) * 0.1).toFixed(2)}</div>
          </div>
          <div class="info-row">
            <div class="label">Total Amount:</div>
            <div class="value">Rs. ${(parseFloat(transaction.amount.replace(/[^0-9.-]+/g,"")) * 1.1).toFixed(2)}</div>
          </div>
        </div>

        <div class="footer">
          Thank you for choosing Electrafind!<br/>
          For support, contact us at support@electrafind.com
        </div>
      </body>
    </html>
    `;
  
    try {
      // Generate the PDF file
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
  
      // Define the path to save the file on the device
      const pdfFileName = `invoice_${transaction.id}.pdf`;
      const pdfFileUri = `${FileSystem.documentDirectory}${pdfFileName}`;
  
      // Save the file to the device
      await FileSystem.moveAsync({
        from: uri,
        to: pdfFileUri,
      });
  
      Alert.alert(
        'Invoice Downloaded',
        `Invoice has been saved to your device at: ${pdfFileUri}`,
        [
          {
            text: 'Open',
            onPress: () => openInvoice(pdfFileUri),
          },
          { text: 'OK' }
        ]
      );
  
    } catch (error) {
      console.error('Failed to generate and save PDF:', error);
      Alert.alert('Error', 'Failed to generate and save invoice');
    }
  };
  
  const openInvoice = async (fileUri) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert('Sharing is not available on this device');
    }
  };
  
  

  const TransactionCard = ({ transaction }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardRow}>
            <Ionicons name="calendar-outline" size={24} color="black" />
            <Text style={styles.cardDate}>{transaction.date}</Text>
          </View>
          <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.cardDropdown}>
            <Ionicons
              name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Ionicons name="document-text-outline" size={24} color="black" />
            <Text style={styles.cardReference}>Reference</Text>
            <Text style={styles.cardText}>{transaction.reference}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="cash-outline" size={24} color="black" />
            <Text style={styles.cardReference}>Amount</Text>
            <Text style={styles.cardText}>{transaction.amount}</Text>
          </View>
          <TouchableOpacity style={styles.invoiceButton}>
            <Text style={styles.invoiceButtonText} onPress={() => generateInvoice(transaction)}>Get Invoice</Text>
          </TouchableOpacity>
        </View>
        {expanded && (
          <View style={styles.expandedContent}>
            <View style={styles.expandedRow}>
              <Ionicons name="time-outline" size={24} color="black" />
              <Text style={styles.expandedText}>Start Time</Text>
              <Text style={styles.expandedText}>{transaction.startTime}</Text>
            </View>
            <View style={styles.expandedRow}>
              <Ionicons name="time-outline" size={24} color="black" />
              <Text style={styles.expandedText}>End Time</Text>
              <Text style={styles.expandedText}>{transaction.endTime}</Text>
            </View>
            <View style={styles.expandedRow}>
              <Ionicons name="timer-outline" size={24} color="black" />
              <Text style={styles.expandedText}>Duration</Text>
              <Text style={styles.expandedText}>{transaction.duration}</Text>
            </View>
            <View style={styles.expandedRow}>
              <Ionicons name="checkmark-circle-outline" size={24} color="black" />
              <Text style={styles.expandedText}>Status</Text>
              <Text style={styles.expandedText}>{transaction.status}</Text>
            </View>
            <View style={styles.expandedRow}>
              <Ionicons name="flash-outline" size={24} color="black" />
              <Text style={styles.expandedText}>Energy Delivered</Text>
              <Text style={styles.expandedText}>{transaction.energyDelivered}</Text>
            </View>
            <View style={styles.expandedRow}>
              <Ionicons name="alert-circle-outline" size={24} color="black" />
              <Text style={styles.expandedText}>Stop Reason</Text>
              <Text style={styles.expandedText}>{transaction.stopReason}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={transactions}
      renderItem={({ item }) => <TransactionCard transaction={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardDate: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardReference: {
    marginLeft: 10,
    fontSize: 14,
    color: '#888',
  },
  cardText: {
    fontSize: 16,
    marginLeft: 5,
  },
  invoiceButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#00AB82',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  invoiceButtonText: {
    color: '#00AB82',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardDropdown: {
    marginLeft: 10,
  },
  expandedContent: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  expandedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  expandedText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
});


